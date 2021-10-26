import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const BaseUrl = "http://localhost:8081/";

export enum REQS {
    ADD_USER = "user/add",
    ADD_TOPIC = "topic/add",
    LOGIN = "user/login"
}

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

export default Connection;
