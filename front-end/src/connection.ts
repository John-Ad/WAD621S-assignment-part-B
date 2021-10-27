import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import io, { Socket } from "socket.io-client";
import { IMessageByTopic } from "../../back-end/src/interfaces";

const BaseUrl = "http://localhost:8081/";

export enum REQS {
    ADD_USER = "user/add",
    ADD_TOPIC = "topic/add",
    ADD_MESSAGE = "message/add",
    LOGIN = "user/login",
    GET_ALL_TOPICS = "topic/all/"
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

    constructor(topicName: string, appendMessage: any) {      //    appendMessage is a callback function 

        //###############################
        //      CONNECT TO SERVER 
        //      AND LISTEN FOR MESSAGES 
        //      FOR TOPIC
        //###############################
        this.socket = io("http://localhost:8081");
        this.socket.on(topicName, (data) => {
            let message: IMessageByTopic = JSON.parse(data);
            appendMessage(message);
        });

    }

    //###############################
    //      EMIT MESSAGES
    //###############################
    public send(data: any) {
        this.socket.emit("client test", data);
    }
}



export default Connection;
