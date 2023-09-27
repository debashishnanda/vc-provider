import express from 'express';
import { createUser, getUser, getDid } from '../controller/user.controller.js';

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
 * /user:
 *  get:
 *      summary: returns a user and its PII in raw, masked and tokenised form
 *      tags: [users]
 *      parameters:
 *      -   name: did
 *          in: query
 *          description: user's did
 *          required: true
 *          type: string
 *      -   name: role
 *          in: query
 *          description: US Infosec Support, Marketing Team, Business Analytics
 *          type: string
 *          required: true
 *          enum: ['US Infosec Support', 'Marketing Team', 'Business Analytics']
 *      -   name: reason
 *          in: query
 *          description: reason to access the user PII
 *          type: string
 *          required: true
 *          enum: ['Analytics and Insights', 'Security', 'Customer Service', 'Transaction and Payments', 'Communication', 'Legal and Regulatory Compliance', 'Membership and Subscriptions']
 *      -   name: vcType
 *          in: query
 *          description: EmailCredential, DateOfBirthCredential, CellPhoneCredential, NameCredential, EmploymentCredential, AddressCredential, SSNCredential
 *          type: string
 *          required: true
 *          enum: ['EmailCredential','DateOfBirthCredential','CellPhoneCredential','NameCredential','EmploymentCredential','AddressCredential','SSNCredential']
 *      responses:
 *          200:
 *              description: ok                
 */
userRoutes.route('/').get(getUser);

/**
 * @swagger
 * /user/did:
 *  get:
 *      summary: returns a user's did 
 *      tags: [users]
 *      parameters:
 *      -   name: phone
 *          in: query
 *          description: User's phone
 *          type: string
 *      -   name: email
 *          in: query
 *          description: User's email
 *          type: string
 *      responses:
 *          200:
 *              description: ok                
 */
userRoutes.route('/did').get(getDid);

export default userRoutes;