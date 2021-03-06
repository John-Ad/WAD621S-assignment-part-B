//##############################################
//      IMPORTS
//##############################################

import dotenv from "dotenv";
import mysql from "mysql";
import { IAddMessage, IAddTopic, IAddUser, IDeleteMessage, IEditMessage, IGetAllTopics, IGetMessagesByTopic, ILogin, ISearchMessages, ISearchTopics } from "./interfaces";


//##############################################
//      SETUP DOTENV
//##############################################

dotenv.config();


//##############################################
//      QUERY ENUMS
//##############################################

export enum QUERY_PROCS {
    ADD_USER = "call sp_addUser",
    ADD_TOPIC = "call sp_addTopic",
    ADD_MESSAGE = "call sp_addMessage",

    EDIT_MESSAGE = "call sp_editMessage",

    LOGIN = "call sp_login",

    DELETE_MESSAGE = "call sp_deleteMessage",

    GET_MESSAGES_BY_TOPIC = "call sp_getMessagesByTopic",
    GET_ALL_TOPICS = "call sp_getAllTopics",

    SEARCH_TOPICS = "call sp_searchTopics",
    SEARCH_MESSAGES = "call sp_searchMessages"
}

//##############################################
//      QUERY ENUMS
//##############################################
export function buildQry(qProc: QUERY_PROCS, data: any): string {
    switch (qProc) {

        //#####################
        //      ADD USER
        //#####################
        case QUERY_PROCS.ADD_USER:
            let uAddData = (data as IAddUser);
            return `${QUERY_PROCS.ADD_USER}('${uAddData.username}', '${uAddData.email}', '${uAddData.password}');`;

        //#####################
        //      ADD TOPIC
        //#####################
        case QUERY_PROCS.ADD_TOPIC:
            let topicAddData = (data as IAddTopic);
            return `${QUERY_PROCS.ADD_TOPIC}('${topicAddData.username}', '${topicAddData.name}');`;

        //#####################
        //      ADD MESSAGE
        //#####################
        case QUERY_PROCS.ADD_MESSAGE:
            let messageAddData = (data as IAddMessage);
            return `${QUERY_PROCS.ADD_MESSAGE}('${messageAddData.username}', '${messageAddData.topicName}', '${messageAddData.content}');`;


        //#####################
        //      EDIT MESSAGE
        //#####################
        case QUERY_PROCS.EDIT_MESSAGE:
            let messageEditData = (data as IEditMessage);
            return `${QUERY_PROCS.EDIT_MESSAGE}(${messageEditData.messageID}, '${messageEditData.content}');`;


        //#####################
        //      LOGIN
        //#####################
        case QUERY_PROCS.LOGIN:
            let loginDetails = (data as ILogin);
            return `${QUERY_PROCS.LOGIN}('${loginDetails.username}','${loginDetails.password}');`;


        //#####################
        //      DELETE MESSAGE
        //#####################
        case QUERY_PROCS.DELETE_MESSAGE:
            let messageDeleteData = (data as IDeleteMessage);
            return `${QUERY_PROCS.DELETE_MESSAGE}(${messageDeleteData.messageID});`;


        //###############################
        //      GET MESSAGES BY TOPIC
        //###############################
        case QUERY_PROCS.GET_MESSAGES_BY_TOPIC:
            let messagesByTopicData = (data as IGetMessagesByTopic);
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
            let topicSearchData = (data as ISearchTopics);
            return `${QUERY_PROCS.SEARCH_TOPICS}('%${topicSearchData.searchTerm}%');`;


        //############################
        //      SEARCH MESSAGES
        //############################
        case QUERY_PROCS.SEARCH_MESSAGES:
            let messageSearchData = (data as ISearchMessages);
            return `${QUERY_PROCS.SEARCH_MESSAGES}('${messageSearchData.topicName}','%${messageSearchData.searchTerm}%');`;
    }
}

//############################################
//      DB CONNECTION CLASS DEFINITION
//############################################

class DB_Connection {
    private connectionPool: mysql.Pool;     // stores connection pool

    constructor() {

        //##########    SETUP CONNECTION POOL   ############

        this.connectionPool = mysql.createPool({
            connectionLimit: 20,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: "NUST_CHAT_BOARD"
        });

    }

    //##########    HANDLE DB QUERIES   ############

    public query(qry: string, callback: (err: mysql.MysqlError, res: any) => void) {
        this.connectionPool.query(qry, callback);
    }

}

export default DB_Connection;
