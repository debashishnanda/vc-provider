import express from 'express';
import { getPIIRequestCount, getTrafficSource } from '../controller/stats.controller.js';

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
 * /stats/piiRequests/{id}:
 *  get:
 *      summary: returns the PII requests made for a user
 *      tags: [stats]
 *      parameters:
 *      -   name: id
 *          in: path
 *          description: user id
 *          required: true
 *          type: number
 *      responses:
 *          200:
 *              description: ok
 *              schema:
 *                  $ref: '#/components/schemas/piiCountResponse'
 */     
statsRoutes.route('/piiRequests/:id').get(getPIIRequestCount);

/**
 * @swagger
 * /stats/trafficSource/{id}:
 *  get:
 *      summary: returns the traffic source grouped by category
 *      tags: [stats]
 *      parameters:
 *      -   name: id
 *          in: path
 *          description: user id
 *          required: true
 *          type: number
 *      responses:
 *          200:
 *              description: ok
 *              schema:
 *                  $ref: '#/components/schemas/piiCountResponse'
 */     
statsRoutes.route('/trafficSource/:id').get(getTrafficSource);

export default statsRoutes;