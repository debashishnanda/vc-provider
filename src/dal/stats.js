import database from "../config/mysql.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import HttpStatus from "../rest/HttpStatus.js";

export const getPIIRequestCountDAL = (userDid) => {
  return new Promise((reject, resolve) => {
    database.query(
      "call credid_vc_provider.pr_get_pii_requests(?)",
      [userDid],
      (error, results) => {
        if (error) {
          logger.info(
            `Error while getting pii request count userId = ${userDid} error=${error} `
          );
          reject(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "User did does not exists."
            )
          );
        } else {
          resolve(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "success",
              results?.[0]?.[0] || {}
            )
          );
        }
      }
    );
  });
};

export const getTrafficSourceDal = (userDid) => {
  return new Promise((reject, resolve) => {
    database.query(
      "call credid_vc_provider.pr_get_traffic_source(?)",
      [userDid],
      (error, results) => {
        if (error) {
          logger.info(
            `Error while getting pii request count userId = ${userDid} error=${error} `
          );
          reject(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "User did does not exists."
            )
          );
        } else {
          const sourcesCount = results?.[0];
          let total = 0;
          sourcesCount.forEach((source) => {
            total += source.count;
          });
          const result = [];
          sourcesCount.forEach((source) => {
            result.push({
              reason: source.reason,
              percentAccess: (
                (source.count.toFixed(2) / total.toFixed(2)) *
                100
              ).toFixed(2),
            });
          });

          resolve(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "success",
              result
            )
          );
        }
      }
    );
  });
};

export const getLatestPIIRequestsDal = (userDid) => {
  return new Promise((reject, resolve) => {
    database.query(
      "call credid_vc_provider.pr_get_latest_pii_requests(?)",
      [userDid],
      (error, results) => {
        if (error) {
          logger.info(
            `Error while getting latests pii requests for userId = ${userDid} error=${error} `
          );
          reject(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "User id does not exists."
            )
          );
        } else {
          resolve(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "success",
              results?.[0] || []
            )
          );
        }
      }
    );
  });
};

export const getMonthlyYearlyPiiReqCountsDal = (
  userDid,
  startDateTime,
  endDateTime
) => {
  return new Promise((reject, resolve) => {
    database.query(
      "call credid_vc_provider.pr_get_monthly_yearly_pii_request_count(?,?,?)",
      [userDid, startDateTime || null, endDateTime || null],
      (error, results) => {
        if (error) {
          logger.info(
            `Error while getting latests pii requests for userId = ${userDid} error=${error} `
          );
          reject(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "User id does not exists."
            )
          );
        } else {
          resolve(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "success",
              results?.[0] || []
            )
          );
        }
      }
    );
  });
};
