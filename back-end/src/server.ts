//###############################
//      DEPENDECY IMPORTS
//###############################

import path from 'path';
import express from 'express';
import http from "http";
import { Express, Request, Response, NextFunction } from 'express';
import { Server } from "socket.io";

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


//###############################
//      SERVE SITE
//###############################
app.use("/", express.static("dist"));



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
