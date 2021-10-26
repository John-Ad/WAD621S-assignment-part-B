//###############################
//      DEPENDECY IMPORTS
//###############################

import path from 'path';
import express from 'express';
import http from "http";
import { Express, Request, Response, NextFunction } from 'express';
import { Server } from "socket.io";
import { IAddUser, ILogin, IResponse } from './interfaces';
import DB_Connection, { buildQry, QUERY_PROCS } from "./database";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server);


//###############################
//      SETUP ACCESS CONTROL
//###############################

app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");      //allows requests from any domain
    inResponse.header("Access-Control-Allow-Methods", "GET,POST");   //allows these methods
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");   //allows these headers
    inNext();
});

app.use(express.json());
app.use(express.urlencoded());


//###############################
//      SERVE SITE
//###############################
app.use("/", express.static("dist"));


//###############################
//      SETUP DB
//###############################

const dbConnection = new DB_Connection();



//##############################################################
//##############################################################
//
//          GET ENDPOINTS
//      
//##############################################################
//##############################################################


//###############################
//      TEST ENDPOINT     
//###############################
app.get("/test", (req, res) => {
    res.send("hello world");
});



//##############################################################
//##############################################################
//
//          POST ENDPOINTS
//      
//##############################################################
//##############################################################


//###############################
//      ADD USER      
//###############################
app.post("/user/add", (req, res) => {

    let userData: IAddUser = req.body;

    let response: IResponse = {
        stat: "ok",
        data: {}
    }


    dbConnection.query(buildQry(QUERY_PROCS.ADD_USER, userData), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }

        if (result[0][0].RESULT != "ok") {
            response.stat = "err";
            response.data = result[0][0].RESULT;
            console.log(result)
        }

        res.json(response);

    });
});



//###############################
//      LOGIN      
//###############################
app.post("/user/login", (req, res) => {

    let data: ILogin = req.body;

    let response: IResponse = {
        stat: "ok",
        data: {}
    }


    dbConnection.query(buildQry(QUERY_PROCS.LOGIN, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }

        if (result[0][0].RESULT != "ok") {
            response.stat = "err";
            response.data = result[0][0].RESULT;
            console.log(result)
        }

        res.json(response);

    });
});

//##############################################################
//##############################################################



//##############################################################
//##############################################################
//
//          WEBSOCKET SETUP
//      
//##############################################################
//##############################################################

io.on('connection', (socket) => {
    console.log("user connected");
});


//###############################
//      START SERVER     
//###############################
server.listen(8081, 'localhost', () => {
    console.log("...server is running...");
});
