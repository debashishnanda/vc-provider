import express from "express";
import {
  getPIIRequestCount,
  getTrafficSource,
  getLatestPIIRequests,
  getMonthlyYearlyPiiReqCounts,
  getTotalSecuredPII
} from "../controller/stats.controller.js";

const statsRoutes = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      piiCountResponse:
 *          type: object
 *          properties:
 *              rawCount:
 *                  type: number
 *                  description: Number of times raw pii was accessed
 *                  example: 23
 *              maskedCount:
 *                  type: number
 *                  description: Number of times masked pii was accessed
 *                  example: 3
 *              tokenisedCount:
 *                  type: number
 *                  description: Number of times tokenised pii was accessed
 *                  example: 273
 *              redactedCount:
 *                  type: number
 *                  description: Number of times tokenised pii was accessed
 *                  example: 209
 */

/**
 * @swagger
 * /stats/piiRequests:
 *  get:
 *      summary: returns the PII requests made for a user
 *      tags: [stats]
 *      parameters:
 *      -   name: did
 *          in: query
 *          description: user did
 *          required: true
 *          type: string
 *      responses:
 *          200:
 *              description: ok
 *              schema:
 *                  $ref: '#/components/schemas/piiCountResponse'
 */
statsRoutes.route("/piiRequests").get(getPIIRequestCount);

/**
 * @swagger
 * /stats/trafficSource:
 *  get:
 *      summary: returns the traffic source grouped by category
 *      tags: [stats]
 *      parameters:
 *      -   name: did
 *          in: query
 *          description: user did
 *          required: true
 *          type: string
 *      responses:
 *          200:
 *              description: ok
 *              schema:
 *                  $ref: '#/components/schemas/piiCountResponse'
 */
statsRoutes.route("/trafficSource").get(getTrafficSource);

/**
 * @swagger
 * /stats/latestPiiRequests:
 *  get:
 *      summary: returns the most recent request for a user
 *      tags: [stats]
 *      parameters:
 *      -   name: did
 *          in: query
 *          description: user did
 *          required: true
 *          type: string
 *      responses:
 *          200:
 *              description: ok
 */
statsRoutes.route("/latestPiiRequests").get(getLatestPIIRequests);


/**
 * @swagger
 * /stats/monthlyPiiRequests:
 *  get:
 *      summary: returns number of pii requests monthly for specified time
 *      tags: [stats]
 *      parameters:
 *      -   name: did
 *          in: query
 *          description: user did
 *          required: true
 *          type: string
 *      -   name: startDateTime
 *          in: query
 *          description: UTC Starting date/time as ISO 8601 string. E.g. 2019-01-01T00:00:00
 *          type: string
 *      -   name: endDateTime
 *          in: query
 *          description: UTC Ending date/time as ISO 8601 string. E.g. 2019-01-01T00:00:00
 *          type: string
 *      responses:
 *          200:
 *              description: ok
 */
statsRoutes.route("/monthlyPiiRequests").get(getMonthlyYearlyPiiReqCounts);

/**
 * @swagger
 * /stats/totalSecuredPII:
 *  get:
 *      summary: returns total number of PIIs
 *      tags: [stats]
 *      responses:
 *          200:
 *              description: ok
 */
statsRoutes.route("/totalSecuredPII").get(getTotalSecuredPII);
export default statsRoutes;
