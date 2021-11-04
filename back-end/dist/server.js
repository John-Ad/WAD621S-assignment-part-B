"use strict";
//###############################
//      DEPENDECY IMPORTS
//###############################
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const database_1 = __importStar(require("./database"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
//###############################
//      SETUP ACCESS CONTROL
//###############################
app.use(function (inRequest, inResponse, inNext) {
    inResponse.header("Access-Control-Allow-Origin", "*"); //allows requests from any domain
    inResponse.header("Access-Control-Allow-Methods", "GET,POST"); //allows these methods
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization"); //allows these headers
    inNext();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
//###############################
//      SERVE SITE
//###############################
app.use("/", express_1.default.static("public"));
//###############################
//      SETUP DB
//###############################
const dbConnection = new database_1.default();
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
    let data = JSON.parse(req.params.data);
    let response = {
        stat: "ok",
        data: {}
    };
    dbConnection.query((0, database_1.buildQry)(database_1.QUERY_PROCS.GET_ALL_TOPICS, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }
        else {
            if (result[0].length > 0) {
                response.data = result[0];
            }
            else {
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
    let data = JSON.parse(req.params.data);
    let response = {
        stat: "ok",
        data: {}
    };
    dbConnection.query((0, database_1.buildQry)(database_1.QUERY_PROCS.GET_MESSAGES_BY_TOPIC, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }
        else {
            if (result[0].length > 0) {
                response.data = result[0];
            }
            else {
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
    let data = JSON.parse(req.params.data);
    let response = {
        stat: "ok",
        data: {}
    };
    dbConnection.query((0, database_1.buildQry)(database_1.QUERY_PROCS.SEARCH_TOPICS, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }
        else {
            if (result[0].length > 0) {
                response.data = result[0];
            }
            else {
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
    let data = JSON.parse(req.params.data);
    let response = {
        stat: "ok",
        data: {}
    };
    dbConnection.query((0, database_1.buildQry)(database_1.QUERY_PROCS.SEARCH_MESSAGES, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }
        else {
            if (result[0].length > 0) {
                if (result[0][0].RESULT) {
                    response.stat = "err";
                    response.data = result[0][0].RESULT;
                }
                else {
                    response.data = result[0];
                }
            }
            else {
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
    let userData = req.body;
    let response = {
        stat: "ok",
        data: {}
    };
    dbConnection.query((0, database_1.buildQry)(database_1.QUERY_PROCS.ADD_USER, userData), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }
        if (result[0][0].RESULT != "ok") {
            response.stat = "err";
            response.data = result[0][0].RESULT;
            console.log(result);
        }
        res.json(response);
    });
});
//###############################
//      ADD TOPIC      
//###############################
app.post("/topic/add", (req, res) => {
    let data = req.body;
    let response = {
        stat: "ok",
        data: {}
    };
    dbConnection.query((0, database_1.buildQry)(database_1.QUERY_PROCS.ADD_TOPIC, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }
        if (result[0][0].RESULT != "ok") {
            response.stat = "err";
            response.data = result[0][0].RESULT;
            console.log(result);
        }
        res.json(response);
    });
});
//###############################
//      ADD MESSAGE      
//###############################
app.post("/message/add", (req, res) => {
    let data = req.body;
    let response = {
        stat: "ok",
        data: {}
    };
    dbConnection.query((0, database_1.buildQry)(database_1.QUERY_PROCS.ADD_MESSAGE, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }
        if (result[0][0].RESULT) {
            response.stat = "err";
            response.data = result[0][0].RESULT;
            console.log(result[0][0].RESULT);
        }
        else {
            //#####################################
            //      SEND MESSAGE TO ALL CLIENTS   
            //#####################################
            let message = result[0][0];
            io.emit(data.topicName + "Add", JSON.stringify(message));
        }
        res.json(response);
    });
});
//###############################
//      EDIT MESSAGE      
//###############################
app.post("/message/edit", (req, res) => {
    let data = req.body;
    let response = {
        stat: "ok",
        data: {}
    };
    dbConnection.query((0, database_1.buildQry)(database_1.QUERY_PROCS.EDIT_MESSAGE, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }
        if (result[0][0].RESULT != "ok") {
            response.stat = "err";
            response.data = result[0][0].RESULT;
            console.log(result[0][0].RESULT);
        }
        else {
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
    let data = req.body;
    let response = {
        stat: "ok",
        data: {}
    };
    dbConnection.query((0, database_1.buildQry)(database_1.QUERY_PROCS.DELETE_MESSAGE, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }
        if (result[0][0].RESULT != "ok") {
            response.stat = "err";
            response.data = result[0][0].RESULT;
            console.log(result[0][0].RESULT);
        }
        else {
            //###############################################
            //      SEND MESSAGE TO REMOVE TO ALL CLIENTS   
            //###############################################
            let messageToRemove = data.messageID;
            io.emit(data.topicName + "Remove", JSON.stringify(messageToRemove));
        }
        res.json(response);
    });
});
//###############################
//      LOGIN      
//###############################
app.post("/user/login", (req, res) => {
    let data = req.body;
    let response = {
        stat: "ok",
        data: {}
    };
    dbConnection.query((0, database_1.buildQry)(database_1.QUERY_PROCS.LOGIN, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            response.stat = "err";
            response.data = error.sqlMessage;
        }
        if (result[0][0].RESULT != "ok") {
            response.stat = "err";
            response.data = result[0][0].RESULT;
            console.log(result);
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
//# sourceMappingURL=server.js.map