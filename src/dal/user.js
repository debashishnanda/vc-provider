import database from "../config/mysql.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import HttpStatus from "../rest/HttpStatus.js";
import MaskData from "maskdata";

export const createUserDAL = (did, data) => {
  logger.info(`create user. did=${did}, data=${JSON.stringify(data)}`);

  return new Promise((resolve, reject) => {
    database.query(
      "call credid_vc_provider.pr_create_user(?,?,?)",
      [did, data?.email, data?.cellPhone],
      (error, results) => {
        if (!results) {
          reject(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "DID already exists."
            )
          );
        } else {
          let piiAdded = 0;

          Object.keys(data).forEach(async (key) => {
            await database.query(
              "call credid_vc_provider.pr_add_user_info(?,?,?)",
              [did, key, data[key]],
              (error, results) => {
                if (error) {
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

export const getUserDAL = (did, role, vcType, reason) => {
  logger.info(
    `get user. did=${did} role=${role} vcType=${vcType} reason=${reason}`
  );

  return new Promise((resolve, reject) => {
    database.query(
      "call credid_vc_provider.pr_get_user_info(?,?)",
      [did, vcType],
      (error, results) => {
        if (!results) {
          reject(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "User did does not exist"
            )
          );
        } else {
          const userInfo = results?.[0];

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
                    case "raw":
                      value = info.value;
                      saveAccessLog(info.id, "raw", reason);
                      break;
                    case "masked":
                      value = mask(info.value, vcType);
                      saveAccessLog(info.id, "masked", reason);
                      break;
                    case "tokenised":
                      value = convertString(info.value);
                      saveAccessLog(info.id, "tokenised", reason);
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
                  type: ["VerifiedCredential", vcType],
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
  });
};

export const getDidDAL = (phone, email) => {
  logger.info(`get Did. phone=${phone} email=${email}`);
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
      "call credid_vc_provider.pr_get_userByEmailOrPhone(?,?)",
      [email, phone],
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

const mask = (input, type) => {
  type = type.toLowerCase();

  if (type.includes("email")) {
    return MaskData.maskEmail2(input, {
      maskWith: "*",
      unmaskedStartCharactersBeforeAt: 3,
      unmaskedEndCharactersAfterAt: 2,
      maskAtTheRate: false,
    });
  } else if (type.includes("cell")) {
    return MaskData.maskPhone(input, {
      maskWith: "*",
      unmaskedStartDigits: 0,
      unmaskedEndDigits: 4,
    });
  } else if (type.includes("dob")) {
    return MaskData.maskCard(input, {
      maskWith: "*",
      unmaskedStartDigits: 2,
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
