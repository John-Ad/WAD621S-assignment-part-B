import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import io, { Socket } from "socket.io-client";
import { IEditMessage, IMessageByTopic } from "../../back-end/src/interfaces";

const BaseUrl = "http://localhost:8081/";

export enum REQS {
    ADD_USER = "user/add",
    ADD_TOPIC = "topic/add",
    ADD_MESSAGE = "message/add",
    EDIT_MESSAGE = "message/edit",
    DELETE_MESSAGE = "message/delete",
    LOGIN = "user/login",
    GET_ALL_TOPICS = "topic/all/",
    GET_MESSAGES_BY_TOPIC = "messages/topic/",
    SEARCH_TOPICS = "topics/search/",
    SEARCH_MESSAGES = "messages/search/"
}

//###############################
//      HTTP CLASS
//###############################
class Connection {

    //#########     GET REQ FUNC    #############

    public static getReq = async (reqType: REQS, data: any) => {
        let response = await Axios.get(BaseUrl + reqType + JSON.stringify(data));
        return response.data;
    }

    //#########     POST REQ FUNC    #############

    public static postReq = async (reqType: REQS, data: any) => {
        let response = await Axios.post(BaseUrl + reqType, data);
        return response.data;
    }
}


//###############################
//      WEBSOCKET CLASS
//###############################
export class ChatWS {

    private socket: Socket;

    constructor(topicName: string, appendMessage: any, removeMessage: any, updateMessage: any) {      //    appendMessage is a callback function 

        //###############################
        //      CONNECT TO SERVER 
        //      AND LISTEN FOR MESSAGES 
        //      FOR TOPIC
        //###############################
        this.socket = io("http://localhost:8081");

        //###################
        //      ON ADD     
        //###################
        this.socket.on(topicName + "Add", (data) => {
            let message: IMessageByTopic = JSON.parse(data);
            appendMessage(message);
        });

        //###################
        //      ON REMOVE
        //###################
        this.socket.on(topicName + "Remove", (data) => {
            let messageToRem: number = JSON.parse(data);
            removeMessage(messageToRem);
        });

        //###################
        //      ON UPDATE
        //###################
        this.socket.on(topicName + "Update", (data) => {
            let messageToEdit: IEditMessage = JSON.parse(data);
            updateMessage(messageToEdit);
        });

    }

    //###############################
    //      EMIT MESSAGES
    //###############################
    public send(topic: string, data: any) {
        this.socket.emit(topic, data);
    }

    //#######################################
    //      DISCONNECT SOCKET FROM SERVER
    //#######################################
    public disconnect() {
        this.socket.disconnect();
    }
}



export default Connection;
