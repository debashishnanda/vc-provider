import express from 'express';
import { createUser, getUser } from '../controller/user.controller.js';

const userRoutes = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              firstName:
 *                  type: string
 *                  description: first name 
 *                  example: Aman
 *              lastName:
 *                  type: string
 *                  description: last name 
 *                  example: Singh
 *              email:
 *                  type: string
 *                  description: email
 *                  example: aman.singh@credid.xyz
 *              dob:
 *                  type: string
 *                  description: Date Of Birth 
 *                  example: 1991/11/18
 *              cellPhone:
 *                  type: string
 *                  description: Mobile number
 *                  example: 8795456874
 *              street:
 *                  type: string
 *                  description: Stret number 
 *                  example: 1790
 *              apt:
 *                  type: string
 *                  description: Apartment Number
 *                  example: 908
 *              city:
 *                  type: string
 *                  description: City 
 *                  example: Toronto
 *              state:
 *                  type: string
 *                  description: State/Province 
 *                  example: Ontario     
 *              zip:
 *                  type: string
 *                  description: ZipCode/ Pin Code
 *                  example: M4A2T3  
 *              ssn:
 *                  type: string
 *                  description: Social Security Number 
 *                  example: 27825353782            
 */

/**
 * @swagger
 * /user:
 *  post:
 *      summary: Add a user and its PII
 *      tags: [users]
 *      parameters:
 *      -   name: did
 *          in: query
 *          description: Decentralized Identity
 *          required: true
 *          type: string        
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: ok
 *                          
 */
userRoutes.route('/').post(createUser);

/**
 * @swagger
 * /user/{id}:
 *  get:
 *      summary: returns a user and its PII in raw, masked and tokenised form
 *      tags: [users]
 *      parameters:
 *      -   name: did
 *          in: path
 *          description: user's did
 *          required: true
 *          type: string
 *      -   name: piiType
 *          in: query
 *          description: raw, masked, tokenised. Keep empty for all.
 *          type: string
 *          required: true
 *          enum: [raw, masked, tokenised, all]
 *      -   name: reason
 *          in: query
 *          description: reason to access the user PII
 *          type: string
 *          required: true
 *          enum: ['Analytics and Insights', 'Security', 'Customer Service', 'Transaction and Payments', 'Communication', 'Legal and Regulatory Compliance', 'Membership and Subscriptions']
 *      responses:
 *          200:
 *              description: ok                
 */
userRoutes.route('/:id').get(getUser);

export default userRoutes;