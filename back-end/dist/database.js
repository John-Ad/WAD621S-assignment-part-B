"use strict";
//##############################################
//      IMPORTS
//##############################################
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQry = exports.QUERY_PROCS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mysql_1 = __importDefault(require("mysql"));
//##############################################
//      SETUP DOTENV
//##############################################
dotenv_1.default.config();
//##############################################
//      QUERY ENUMS
//##############################################
var QUERY_PROCS;
(function (QUERY_PROCS) {
    QUERY_PROCS["ADD_USER"] = "call sp_addUser";
    QUERY_PROCS["ADD_TOPIC"] = "call sp_addTopic";
    QUERY_PROCS["ADD_MESSAGE"] = "call sp_addMessage";
    QUERY_PROCS["EDIT_MESSAGE"] = "call sp_editMessage";
    QUERY_PROCS["LOGIN"] = "call sp_login";
    QUERY_PROCS["DELETE_MESSAGE"] = "call sp_deleteMessage";
    QUERY_PROCS["GET_MESSAGES_BY_TOPIC"] = "call sp_getMessagesByTopic";
    QUERY_PROCS["GET_ALL_TOPICS"] = "call sp_getAllTopics";
    QUERY_PROCS["SEARCH_TOPICS"] = "call sp_searchTopics";
    QUERY_PROCS["SEARCH_MESSAGES"] = "call sp_searchMessages";
})(QUERY_PROCS = exports.QUERY_PROCS || (exports.QUERY_PROCS = {}));
//##############################################
//      QUERY ENUMS
//##############################################
function buildQry(qProc, data) {
    switch (qProc) {
        //#####################
        //      ADD USER
        //#####################
        case QUERY_PROCS.ADD_USER:
            let uAddData = data;
            return `${QUERY_PROCS.ADD_USER}('${uAddData.username}', '${uAddData.email}', '${uAddData.password}');`;
        //#####################
        //      ADD TOPIC
        //#####################
        case QUERY_PROCS.ADD_TOPIC:
            let topicAddData = data;
            return `${QUERY_PROCS.ADD_TOPIC}('${topicAddData.username}', '${topicAddData.name}');`;
        //#####################
        //      ADD MESSAGE
        //#####################
        case QUERY_PROCS.ADD_MESSAGE:
            let messageAddData = data;
            return `${QUERY_PROCS.ADD_MESSAGE}('${messageAddData.username}', '${messageAddData.topicName}', '${messageAddData.content}');`;
        //#####################
        //      EDIT MESSAGE
        //#####################
        case QUERY_PROCS.EDIT_MESSAGE:
            let messageEditData = data;
            return `${QUERY_PROCS.EDIT_MESSAGE}(${messageEditData.messageID}, '${messageEditData.content}');`;
        //#####################
        //      LOGIN
        //#####################
        case QUERY_PROCS.LOGIN:
            let loginDetails = data;
            return `${QUERY_PROCS.LOGIN}('${loginDetails.username}','${loginDetails.password}');`;
        //#####################
        //      DELETE MESSAGE
        //#####################
        case QUERY_PROCS.DELETE_MESSAGE:
            let messageDeleteData = data;
            return `${QUERY_PROCS.DELETE_MESSAGE}(${messageDeleteData.messageID});`;
        //###############################
        //      GET MESSAGES BY TOPIC
        //###############################
        case QUERY_PROCS.GET_MESSAGES_BY_TOPIC:
            let messagesByTopicData = data;
            return `${QUERY_PROCS.GET_MESSAGES_BY_TOPIC}('${messagesByTopicData.topicName}');`;
        //############################
        //      GET ALL TOPICS
        //############################
        case QUERY_PROCS.GET_ALL_TOPICS:
            //let topicsData = (data as IGetAllTopics);
            return `${QUERY_PROCS.GET_ALL_TOPICS}();`;
        //############################
        //      SEARCH TOPICS
        //############################
        case QUERY_PROCS.SEARCH_TOPICS:
            let topicSearchData = data;
            return `${QUERY_PROCS.SEARCH_TOPICS}('%${topicSearchData.searchTerm}%');`;
        //############################
        //      SEARCH MESSAGES
        //############################
        case QUERY_PROCS.SEARCH_MESSAGES:
            let messageSearchData = data;
            return `${QUERY_PROCS.SEARCH_MESSAGES}('${messageSearchData.topicName}','%${messageSearchData.searchTerm}%');`;
    }
}
exports.buildQry = buildQry;
//############################################
//      DB CONNECTION CLASS DEFINITION
//############################################
class DB_Connection {
    constructor() {
        //##########    SETUP CONNECTION POOL   ############
        this.connectionPool = mysql_1.default.createPool({
            connectionLimit: 20,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: "NUST_CHAT_BOARD"
        });
    }
    //##########    HANDLE DB QUERIES   ############
    query(qry, callback) {
        this.connectionPool.query(qry, callback);
    }
}
exports.default = DB_Connection;
//# sourceMappingURL=database.js.map