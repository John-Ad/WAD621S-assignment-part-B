import mysql from "mysql";
export declare enum QUERY_PROCS {
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
export declare function buildQry(qProc: QUERY_PROCS, data: any): string;
declare class DB_Connection {
    private connectionPool;
    constructor();
    query(qry: string, callback: (err: mysql.MysqlError, res: any) => void): void;
}
export default DB_Connection;
