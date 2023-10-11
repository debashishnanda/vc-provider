import express from 'express';
import { createUser, getUser, getDid, getPiiList } from '../controller/user.controller.js';

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
 *              middleName:
 *                  type: string
 *                  description: middle name 
 *                  example: Singh
 *              lastName:
 *                  type: string
 *                  description: last name 
 *                  example: Bhandari
 *              domain:
 *                  type: string
 *                  description: Email Domain
 *                  example: "@credid.xyz"
 *              localPart:
 *                  type: string
 *                  description: Local part in the email
 *                  example: aman.singh
 *              emailAddress:
 *                  type: string
 *                  description: Email Address
 *                  example: aman.singh@credid.xyz
 *              dayOfBirth:
 *                  type: string
 *                  description: Day Of Birth. Format DD
 *                  example: 18
 *              monthOfBirth:
 *                  type: string
 *                  description: Month Of Birth. Format MM
 *                  example: 11
 *              yearOfBirth:
 *                  type: string
 *                  description: Year Of Birth. Format YYYY
 *                  example: 1991
 *              completeDateOfBirth:
 *                  type: string
 *                  description: Date Of Birth. Format YYYY/MM/DD
 *                  example: 1991/11/18
 *              countryCode:
 *                  type: string
 *                  description: Mobile number
 *                  example: +1
 *              areaCode:
 *                  type: string
 *                  description: Mobile number
 *                  example: 902
 *              mobileNumber:
 *                  type: string
 *                  description: Mobile number
 *                  example: 9895671
 *              msisdn:
 *                  type: string
 *                  description: Mobile number
 *                  example: +19029895671
 *              streetAddress:
 *                  type: string
 *                  description: Street number 
 *                  example: 1790
 *              aptSuiteNumber:
 *                  type: string
 *                  description: Apartment Number
 *                  example: 908
 *              addressLocality:
 *                  type: string
 *                  description: City 
 *                  example: North York
 *              addressRegion:
 *                  type: string
 *                  description: State/Province 
 *                  example: Ontario  
 *              addressCountry:
 *                  type: string
 *                  description: Country
 *                  example: Canada  
 *              postalCode:
 *                  type: string
 *                  description: ZipCode/ Pin Code
 *                  example: M4A2T3  
 *              socialSecurityNumber:
 *                  type: string
 *                  description: Social Security Number. Format AAA-GG-SSSSS
 *                  example: 123-45-6789
 *              last4digits:
 *                  type: string
 *                  description: Last four digits of Social Security Number. Format SSSSS
 *                  example: 6789
 *              employerName:
 *                  type: string
 *                  description: Name of the employer 
 *                  example: Credid  
 *              jobTitle:
 *                  type: string
 *                  description: Job title
 *                  example: Software Engineer
 *              employmentStartDate:
 *                  type: string
 *                  description: Start date of the employment YYYY-MM-DD
 *                  example: 2017-05-08
 *              employmentEndDate:
 *                  type: string
 *                  description: End Date of the employment YYYY-MM-DD
 *                  example: 2021-09-30
 */

/**
 * @swagger
 * /user/{tenantId}:
 *  post:
 *      summary: Add a user and its PII
 *      tags: [users]
 *      parameters:
 *      -   name: tenantId
 *          in: path
 *          description: Tenant Id
 *          required: true
 *          type: number
 *      -   name: did
 *          in: query
 *          description: Decentralized Identity
 *          required: true
 *          type: string     
 *          example: did:ion:test:JSEODXKSYDUDHSSIEUJDJDI  
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
userRoutes.route('/:tenantId').post(createUser);

/**
 * @swagger
 * /user/{tenantId}:
 *  get:
 *      summary: returns a user and its PII in raw, masked, redacted or tokenized form
 *      tags: [users]
 *      parameters:
 *      -   name: tenantId
 *          in: path
 *          description: tenant id
 *          required: true
 *          type: string
 *      -   name: did
 *          in: query
 *          description: user's did
 *          required: true
 *          type: string
 *      -   name: role
 *          in: query
 *          description: US Infosec Support, Marketing Team, Business Analytics, Consultants
 *          type: string
 *          required: true
 *          enum: ['US Infosec Support', 'Marketing Team', 'Business Analytics', 'Consultants']
 *      -   name: reason
 *          in: query
 *          description: reason to access the user PII. Analytics and Insights, Security, Customer Service, Transaction and Payments, Communication, Legal and Regulatory Compliance, Membership and Subscriptions
 *          type: string
 *          required: true
 *          enum: ['Analytics and Insights', 'Security', 'Customer Service', 'Transaction and Payments', 'Communication', 'Legal and Regulatory Compliance', 'Membership and Subscriptions']
 *      -   name: vcType
 *          in: query
 *          description: EmailCredential, DateOfBirthCredential, MobileNumberCredential, NameCredential, EmploymentCredential, PostalAddressCredential, SocialSecurityNumberCredential
 *          type: string
 *          required: true
 *          enum: ['EmailCredential','DateOfBirthCredential','MobileNumberCredential','NameCredential','EmploymentCredential','PostalAddressCredential','SocialSecurityNumberCredential']
 *      responses:
 *          200:
 *              description: ok                
 */
userRoutes.route('/:tenantId').get(getUser);

/**
 * @swagger
 * /user/did/{tenantId}:
 *  get:
 *      summary: returns a user's did 
 *      tags: [users]
 *      parameters:
 *      -   name: tenantId
 *          in: path
 *          description: tenant Id
 *          type: number
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
userRoutes.route('/did/:tenantId').get(getDid);

/**
 * @swagger
 * /user/piiList/{tenantId}:
 *  get:
 *      summary: returns a user's pii lists
 *      tags: [users]
 *      parameters:
 *      -   name: tenantId
 *          in: path
 *          description: Tenant Id
 *          type: number
 *      -   name: did
 *          in: query
 *          description: User's did
 *          type: string
 *      responses:
 *          200:
 *              description: ok                
 */
userRoutes.route('/piiList/:tenantId').get(getPiiList);

export default userRoutes;