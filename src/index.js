import express from "express";
import ip from "ip";
import dotenv from "dotenv";
import cors from "cors";
import Response from './domain/response.js'
import logger from './util/logger.js'
import HttpStatus from "./controller/user.controller.js";
import userRoutes from "./route/user.route.js";
import swaggerUI from "swagger-ui-express";
import  swaggerJsDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "Credid VC Provider APIs"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
    },
    apis: ["./src/route/*.js"]
};

const specs = swaggerJsDoc(options);

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use('/user', userRoutes);
app.get('/',(req,res) => res.send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'vc-provider v1- All good')));
app.get('*',(req,res) => res.status(HttpStatus.NOT_FOUND.code.send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, 'Route does not exist'))));

app.listen(PORT, ()=> {
    logger.info(`Server is running on : ${ip.address()}:${PORT}`);
})