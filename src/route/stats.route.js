import express from "express";
import {
  getPIIRequestCount,
  getTrafficSource,
  getLatestPIIRequests,
  getMonthlyYearlyPiiReqCounts
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
 */

/**
 * @swagger
 * /stats/piiRequests/{did}:
 *  get:
 *      summary: returns the PII requests made for a user
 *      tags: [stats]
 *      parameters:
 *      -   name: did
 *          in: path
 *          description: user did
 *          required: true
 *          type: string
 *      responses:
 *          200:
 *              description: ok
 *              schema:
 *                  $ref: '#/components/schemas/piiCountResponse'
 */
statsRoutes.route("/piiRequests/:did").get(getPIIRequestCount);

/**
 * @swagger
 * /stats/trafficSource/{did}:
 *  get:
 *      summary: returns the traffic source grouped by category
 *      tags: [stats]
 *      parameters:
 *      -   name: did
 *          in: path
 *          description: user did
 *          required: true
 *          type: string
 *      responses:
 *          200:
 *              description: ok
 *              schema:
 *                  $ref: '#/components/schemas/piiCountResponse'
 */
statsRoutes.route("/trafficSource/:did").get(getTrafficSource);

/**
 * @swagger
 * /stats/latestPiiRequests/{did}:
 *  get:
 *      summary: returns the most recent request for a user
 *      tags: [stats]
 *      parameters:
 *      -   name: did
 *          in: path
 *          description: user did
 *          required: true
 *          type: string
 *      responses:
 *          200:
 *              description: ok
 */
statsRoutes.route("/latestPiiRequests/:did").get(getLatestPIIRequests);


/**
 * @swagger
 * /stats/monthlyPiiRequests/{id}:
 *  get:
 *      summary: returns number of pii requests monthly for specified time
 *      tags: [stats]
 *      parameters:
 *      -   name: id
 *          in: path
 *          description: user id
 *          required: true
 *          type: number
 *      -   name: startDateTime
 *          in: query
 *          description: Starting date/time as ISO 8601 string. E.g. 2019-01-01T00:00:00
 *          required: true
 *          type: string
 *      -   name: endDateTime
 *          in: query
 *          description: Ending date/time as ISO 8601 string. E.g. 2019-01-01T00:00:00
 *          required: true
 *          type: string
 *      responses:
 *          200:
 *              description: ok
 */
statsRoutes.route("/monthlyPiiRequests/:id").get(getMonthlyYearlyPiiReqCounts);
export default statsRoutes;
