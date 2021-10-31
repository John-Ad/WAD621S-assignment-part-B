//###############################
//      DEPENDECY IMPORTS
//###############################

import path from 'path';
import express from 'express';
import http from "http";
import { Express, Request, Response, NextFunction } from 'express';
import { Server } from "socket.io";
import { IAddMessage, IMessageByTopic, IAddTopic, IAddUser, IGetAllTopics, ILogin, IResponse, IDeleteMessage, IGetMessagesByTopic, IEditMessage, ISearchTopics, ISearchMessages } from './interfaces';
import DB_Connection, { buildQry, QUERY_PROCS } from "./database";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


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


//###############################
//      GET ALL TOPICS      
//###############################
app.get("/topic/all/:data", (req, res) => {

    let data: IGetAllTopics = JSON.parse(req.params.data);

    let response: IResponse = {
        stat: "ok",
        data: {}
    }

    dbConnection.query(buildQry(QUERY_PROCS.GET_ALL_TOPICS, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        } else {
            if (result[0].length > 0) {
                response.data = result[0];
            } else {
                response.stat = "err";
                response.data = "no records found";
            }
        }

        res.json(response);

    });
});


//###############################
//      GET MESSAGES BY TOPIC      
//###############################
app.get("/messages/topic/:data", (req, res) => {

    let data: IGetMessagesByTopic = JSON.parse(req.params.data);

    let response: IResponse = {
        stat: "ok",
        data: {}
    }

    dbConnection.query(buildQry(QUERY_PROCS.GET_MESSAGES_BY_TOPIC, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        } else {
            if (result[0].length > 0) {
                response.data = result[0];
            } else {
                response.stat = "err";
                response.data = "no records found";
            }
        }

        res.json(response);

    });
});


//###############################
//      SEARCH TOPICS      
//###############################
app.get("/topics/search/:data", (req, res) => {

    let data: ISearchTopics = JSON.parse(req.params.data);

    let response: IResponse = {
        stat: "ok",
        data: {}
    }

    dbConnection.query(buildQry(QUERY_PROCS.SEARCH_TOPICS, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        } else {
            if (result[0].length > 0) {
                response.data = result[0];
            } else {
                response.stat = "err";
                response.data = "no records found";
            }
        }

        res.json(response);

    });
});


//###############################
//      SEARCH MESSAGES      
//###############################
app.get("/messages/search/:data", (req, res) => {

    let data: ISearchMessages = JSON.parse(req.params.data);

    let response: IResponse = {
        stat: "ok",
        data: {}
    }

    dbConnection.query(buildQry(QUERY_PROCS.SEARCH_MESSAGES, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        } else {
            if (result[0].length > 0) {
                if (result[0][0].RESULT) {
                    response.stat = "err";
                    response.data = result[0][0].RESULT;
                } else {
                    response.data = result[0];
                }
            } else {
                response.stat = "err";
                response.data = "no records found";
            }

        }

        res.json(response);
    });
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
//      ADD TOPIC      
//###############################

app.post("/topic/add", (req, res) => {

    let data: IAddTopic = req.body;

    let response: IResponse = {
        stat: "ok",
        data: {}
    }


    dbConnection.query(buildQry(QUERY_PROCS.ADD_TOPIC, data), (error, result) => {
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
//      ADD MESSAGE      
//###############################
app.post("/message/add", (req, res) => {

    let data: IAddMessage = req.body;

    let response: IResponse = {
        stat: "ok",
        data: {}
    }


    dbConnection.query(buildQry(QUERY_PROCS.ADD_MESSAGE, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }

        if (result[0][0].RESULT) {
            response.stat = "err";
            response.data = result[0][0].RESULT;
            console.log(result[0][0].RESULT);
        } else {
            //#####################################
            //      SEND MESSAGE TO ALL CLIENTS   
            //#####################################
            let message: IMessageByTopic = result[0][0];
            io.emit(data.topicName + "Add", JSON.stringify(message));
        }

        res.json(response);

    });
});


//###############################
//      EDIT MESSAGE      
//###############################
app.post("/message/edit", (req, res) => {

    let data: IEditMessage = req.body;

    let response: IResponse = {
        stat: "ok",
        data: {}
    }


    dbConnection.query(buildQry(QUERY_PROCS.EDIT_MESSAGE, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }

        if (result[0][0].RESULT != "ok") {
            response.stat = "err";
            response.data = result[0][0].RESULT;
            console.log(result[0][0].RESULT);
        } else {
            //#########################################################
            //      SEND MESSAGE TO UPDATE TO ALL CLIENTS   
            //#########################################################
            io.emit(data.topicName + "Update", JSON.stringify(data));
        }

        res.json(response);

    });
});


//###############################
//      DELETE MESSAGE      
//###############################
app.post("/message/delete", (req, res) => {

    let data: IDeleteMessage = req.body;

    let response: IResponse = {
        stat: "ok",
        data: {}
    }


    dbConnection.query(buildQry(QUERY_PROCS.DELETE_MESSAGE, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }

        if (result[0][0].RESULT != "ok") {
            response.stat = "err";
            response.data = result[0][0].RESULT;
            console.log(result[0][0].RESULT);
        } else {
            //###############################################
            //      SEND MESSAGE TO REMOVE TO ALL CLIENTS   
            //###############################################
            let messageToRemove: number = data.messageID;
            io.emit(data.topicName + "Remove", JSON.stringify(messageToRemove));
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
