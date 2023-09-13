import database from "../config/mysql.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import QUERY from "../query/user.query.js";

const HttpStatus = {
  OK: {
    code: 200,
    status: "Ok",
  },
  CREATED: {
    code: 201,
    status: "Created",
  },
  NO_CONTENT: {
    code: 204,
    status: "No Content",
  },
  BAD_REQUEST: {
    code: 400,
    status: "Bad Request",
  },
  NOT_FOUND: {
    code: 404,
    status: "Not found",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    status: "Internal Server Error",
  },
};

export const createUser = (req, res) => {
  logger.info(`${req.method} ${req.originalurl}, create user `);
  const did = req.query.did;
  database.query(
    "call credid_vc_provider.pr_create_user(?)",
    [did],
    (error, results) => {
      if (!results) {
        res
          .status(HttpStatus.BAD_REQUEST.code)
          .send(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "DID already exists."
            )
          );
      } else {
        const userId = results?.[0]?.[0].id;
        const pii = req.body;
        let piiAdded = 0;

        Object.keys(pii).forEach(async (key) => {
          await database.query(
            "call credid_vc_provider.pr_add_user_info(?,?,?)",
            [userId, key, pii[key]],
            (error, results) => {
              if (error) {
                res
                  .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                  .send(
                    new Response(
                      HttpStatus.INTERNAL_SERVER_ERROR.code,
                      HttpStatus.INTERNAL_SERVER_ERROR.status,
                      `Unable to add info`
                    )
                  );
              } else {
                piiAdded++;
                if (piiAdded === Object.keys(pii).length) {
                  res
                    .status(HttpStatus.OK.code)
                    .send(
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
};
export default HttpStatus;
