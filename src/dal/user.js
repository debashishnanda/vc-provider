import database from "../config/mysql.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import HttpStatus from "../rest/HttpStatus.js";
import MaskData from "maskdata";

const RAW = "raw",
  MASKED = "masked",
  TOKENIZED = "tokenized",
  REDACTED = "redacted";

export const createUserDAL = (tenantId, did, data) => {
  logger.info(
    `create user. tenantId=${tenantId}, did=${did}, data=${JSON.stringify(
      data
    )}`
  );

  return new Promise((resolve, reject) => {
    database.query(
      "call credid_vc_provider.pr_create_user(?,?,?,?)",
      [tenantId, did, data?.emailAddress, data?.msisdn],
      (error, results) => {
        if (!results) {
          reject(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "DID, email or phone already exists."
            )
          );
        } else {
          let piiAdded = 0;

          Object.keys(data).forEach(async (key) => {
            await database.query(
              "call credid_vc_provider.pr_add_user_info(?,?,?)",
              [results?.[0]?.[0].userId, key, data[key]],
              (error, results) => {
                if (error) {
                  console.log("Error in adding user ", error);
                  resolve(
                    new Response(
                      HttpStatus.INTERNAL_SERVER_ERROR.code,
                      HttpStatus.INTERNAL_SERVER_ERROR.status,
                      `Unable to add info`
                    )
                  );
                } else {
                  piiAdded++;
                  if (piiAdded === Object.keys(data).length) {
                    resolve(
                      new Response(
                        HttpStatus.OK.code,
                        HttpStatus.OK.status,
                        `success`
                      )
                    );
                  }
                }
              }
            );
          });
        }
      }
    );
  });
};

export const getUserDAL = (tenantId, did, role, vcType, reason) => {
  logger.info(
    `get user. tenantId= ${tenantId} did=${did} role=${role} vcType=${vcType} reason=${reason}`
  );

  return new Promise((resolve, reject) => {
    database.query(
      "call credid_vc_provider.pr_get_user_info_for_vc(?,?,?)",
      [tenantId, did, vcType],
      (error, results) => {
        if (!results) {
          console.log(`Error while getting user info for a vc type ${error}`);
          reject(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "User does not exist"
            )
          );
        } else {
          const userInfo = results?.[0];

          database.query(
            "call credid_vc_provider.pr_get_parent_vc_type(?)",
            [vcType],
            (error, results) => {
              if (!results) {
                reject(
                  new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.status,
                    "Verified credential not found"
                  )
                );
              } else {
                const vcList = results?.[0];

                database.query(
                  "call credid_vc_provider.pr_get_piiType_for_role(?)",
                  [role],
                  (error, results) => {
                    if (!results) {
                      reject(
                        new Response(
                          HttpStatus.BAD_REQUEST.code,
                          HttpStatus.BAD_REQUEST.status,
                          "Role does not exist"
                        )
                      );
                    } else {
                      const pii_type = results?.[0]?.[0]?.pii_type;
                      const response = [];

                      const credentialsSubject = {};

                      let issuanceDate, expirationDate;

                      userInfo.forEach((info) => {
                        issuanceDate = info.issueDate;
                        expirationDate = info.expiryDate;
                        credentialsSubject.id = info.did;
                        let value;
                        switch (pii_type) {
                          case RAW:
                            value = info.value;
                            saveAccessLog(info.id, RAW, reason);
                            break;
                          case MASKED:
                            value = mask(info.value, vcType);
                            saveAccessLog(info.id, MASKED, reason);
                            break;
                          case TOKENIZED:
                            value = convertString(info.value);
                            saveAccessLog(info.id, TOKENIZED, reason);
                            break;
                          case REDACTED:
                            value = null;
                            saveAccessLog(info.id, REDACTED, reason);
                            break;
                          default:
                            break;
                        }

                        if (credentialsSubject[pii_type]) {
                          credentialsSubject[pii_type][info.name] = value;
                        } else {
                          credentialsSubject[pii_type] = {
                            [info.name]: value,
                          };
                        }
                      });

                      response.push({
                        context: [
                          "https://www.w3.org/2018/credentials/v1",
                          "https://www.schema.org",
                        ],
                        type: vcList.map((vc) => vc.name),
                        issuer: "https://example.com/issuer",
                        issuanceDate,
                        expirationDate,
                        credentialsSubject,
                      });

                      resolve(
                        new Response(
                          HttpStatus.OK.code,
                          HttpStatus.OK.status,
                          "success",
                          response
                        )
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
};

export const getDidDAL = (tenantId, phone, email) => {
  logger.info(`get Did. tenantId= ${tenantId} phone=${phone} email=${email}`);
  return new Promise((resolve, reject) => {
    if (!email && !phone) {
      reject(
        new Response(
          HttpStatus.BAD_REQUEST.code,
          HttpStatus.BAD_REQUEST.status,
          "Both email and phone cannot be empty"
        )
      );
    }
    database.query(
      "call credid_vc_provider.pr_get_userByEmailOrPhone(?,?,?)",
      [tenantId, email, phone],
      (error, results) => {
        if (!results) {
          reject(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "Email and Phone does not exist"
            )
          );
        } else {
          resolve(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "success",
              results?.[0]?.[0]
            )
          );
        }
      }
    );
  });
};

export const getPiiListDAL = (tenantId, did) => {
  logger.info(`get PII list of user with [tenantId]=${tenantId} [did]=${did}`);

  return new Promise((resolve, reject) => {
    if (!did) {
      reject(
        new Response(
          HttpStatus.BAD_REQUEST.code,
          HttpStatus.BAD_REQUEST.status,
          "User'd did cannot be empty"
        )
      );
    }
    database.query(
      "call credid_vc_provider.pr_get_user_info(?,?)",
      [tenantId, did],
      (error, results) => {
        if (error) {
          logger.info(error);
          reject(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "User's did does not exist"
            )
          );
        } else {
          const userInfo = results?.[0];
          const response = [];
          const vcList = database.query(
            "select id, name, parentId from credential_type",
            [],
            (error, results) => {
              if (error) {
                logger.info(error);
                reject(
                  new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.status,
                    "credential does not exist"
                  )
                );
              } else {
                 const vcList = results;

                 userInfo.forEach(info => {
                  const vcs = getVcHierarchy(info.credentialType, vcList);
                  const credentialsSubject = {};
                  let issuanceDate, expirationDate;
                  const vc_credential = response.filter((vc) =>
                    vc?.type?.includes(info.credentialType)
                  ); //pick the vc for credential type
      
                  if (vc_credential.length === 0) {
                    //vc not added yet
                    issuanceDate = info.issueDate;
                    expirationDate = info.expiryDate;
                    credentialsSubject.id = info.did;
                    credentialsSubject[RAW] = { [info.name]: info.value };
                    credentialsSubject[MASKED] = {
                      [info.name]: mask(info.value, info.credentialType),
                    };
                    credentialsSubject[TOKENIZED] = {
                      [info.name]: convertString(info.value),
                    };
                    credentialsSubject[REDACTED] = { [info.name]: null };
                    response.push({
                      context: [
                        "https://www.w3.org/2018/credentials/v1",
                        "https://www.schema.org",
                      ],
                      type: vcs,
                      issuer: "https://example.com/issuer",
                      issuanceDate,
                      expirationDate,
                      credentialsSubject,
                    });
                  } else {
                    vc_credential[0].credentialsSubject[RAW][info.name] = info.value;
                    vc_credential[0].credentialsSubject[MASKED][info.name] = mask(
                      info.value,
                      info.credentialType
                    );
                    vc_credential[0].credentialsSubject[TOKENIZED][info.name] =
                      convertString(info.value);
                    vc_credential[0].credentialsSubject[REDACTED][info.name] = null;
                  }
                });
      
                resolve(
                  new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.status,
                    "success",
                    response
                  )
                );
              }
            }
          );
        }
      }
    );
  });
};

const mask = (input, type) => {
  type = type.toLowerCase();

  if (type.includes("email") && input.includes('@')) {
    return MaskData.maskEmail2(input, {
      maskWith: "*",
      unmaskedStartCharactersBeforeAt: 3,
      unmaskedEndCharactersAfterAt: 2,
      maskAtTheRate: false,
    });
  } else if (type.includes("mobile")) {
    return MaskData.maskPhone(input, {
      maskWith: "*",
      unmaskedStartDigits: 0,
      unmaskedEndDigits: 1,
    });
  } else if (type.includes("date")) {
    return MaskData.maskCard(input, {
      maskWith: "*",
      unmaskedStartDigits: 0,
      unmaskedEndDigits: 1,
    });
  } else {
    return `${input}`
      .slice(-(input.length / 3))
      .padStart(`${input}`.length, "*");
  }
};

function convertString(inputString) {
  // Define a shift value (you can change this to any number you like)
  let shift = 9; // For example, shift each character by 3 positions

  let result = "";

  for (let i = 0; i < inputString.length; i++) {
    const char = inputString.charAt(i);
    shift = (shift + 2) % 9;

    // Check if the character is an uppercase letter
    if (/[A-Z]/.test(char)) {
      // Shift uppercase letters, wrap around if necessary
      const shiftedChar = String.fromCharCode(
        ((char.charCodeAt(0) - 65 + shift) % 26) + 65
      );
      result += shiftedChar;
    } else if (/[a-z]/.test(char)) {
      // Shift lowercase letters, wrap around if necessary
      const shiftedChar = String.fromCharCode(
        ((char.charCodeAt(0) - 97 + shift) % 26) + 97
      );
      result += shiftedChar;
    } else if (/[0-9]/.test(char)) {
      // Shift lowercase letters, wrap around if necessary
      const shiftedChar = String.fromCharCode(
        ((char.charCodeAt(0) - 48 + shift) % 9) + 48
      );
      result += shiftedChar;
    } else {
      // Keep characters unchanged
      result += char;
    }
  }

  return result;
}

const saveAccessLog = (userInfoId, piiType, reason) => {
  database.query(
    `call credid_vc_provider.pr_store_pii_access(?,?,?)`,
    [userInfoId, piiType, reason],
    (error, results) => {
      if (error) {
        logger.info(
          `Error saving access log for userInfoId=${userInfoId}, piiType=${piiType}, reason=${reason} error= ${error}`
        );
      }
    }
  );
};

const getVcHierarchy = (name, vcList) => {
  const list = [];
  let current = vcList.filter(vc => vc.name === name)?.[0];

  while(current.parentId != 0) {
    list.unshift(current.name);
    current = vcList.filter(vc => vc.id === current.parentId)?.[0];
  }
  list.unshift(current.name);

  return list;
}
