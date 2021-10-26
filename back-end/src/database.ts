//##############################################
//      IMPORTS
//##############################################

import dotenv from "dotenv";
import mysql from "mysql";
import { IAddMessage, IAddTopic, IAddUser, IDeleteMessage, IGetMessagesByTopic, ILogin } from "./interfaces";


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

    LOGIN = "call sp_login",

    DELETE_MESSAGE = "call sp_deleteMessage",

    GET_MESSAGES_BY_TOPIC = "call sp_getMessagesByTopic"
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
            return `${QUERY_PROCS.ADD_TOPIC}(${topicAddData.userID}, '${topicAddData.name}');`;

        //#####################
        //      ADD MESSAGE
        //#####################
        case QUERY_PROCS.ADD_MESSAGE:
            let messageAddData = (data as IAddMessage);
            return `${QUERY_PROCS.ADD_MESSAGE}(${messageAddData.userID}, ${messageAddData.topicID}, '${messageAddData.content}');`;


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


        //############################
        //      GET MESSAGES BY TOPIC
        //############################
        case QUERY_PROCS.GET_MESSAGES_BY_TOPIC:
            let messagesByTopicData = (data as IGetMessagesByTopic);
            return `${QUERY_PROCS.GET_MESSAGES_BY_TOPIC}(${messagesByTopicData.topicID});`;

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
