//###############################
//      REACT IMPORTS
//###############################

import React from "react";


//###############################
//      INTERFACE IMPORTS
//###############################

import { IDeleteMessage, IMessageByTopic, IResponse } from "../../../../back-end/src/interfaces";
import Connection, { REQS } from "../../connection";


//###############################
//      CSS IMPORTS
//###############################

import "./chatMessage.css";


//###############################
//      STATE/PROPS
//###############################

interface IProps {
    message: IMessageByTopic,
    username: string,
    topicName: string
}


//###############################
//      CLASS DEFINITION
//###############################

class ChatMessage extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
    }


    //###############################
    //      DELETE MESSAGE
    //###############################
    deleteMessage = async () => {
        let data: IDeleteMessage = {
            messageID: this.props.message.MessageID,
            topicName: this.props.topicName
        }

        let response: IResponse = await Connection.postReq(REQS.DELETE_MESSAGE, data);

        if (response.stat != "ok") {
            alert(response.data);
        }
    }


    render() {
        return (
            <div id="chat-message" className="flex-column center">
                <div id="message-header" className="flex-row">
                    <p>{this.props.message.Username}</p>
                    <p>{this.props.message.Date_Added}</p>

                    {
                        //###############################
                        //      DELETE BUTTON
                        //###############################
                        this.props.message.Username === this.props.username &&
                        <div onClick={this.deleteMessage} className="flex-row">
                            <p className="center">Delete</p>
                        </div>
                    }
                </div>

                <div id="message-content" className="center">
                    <p>{this.props.message.Content}</p>
                </div>
            </div>
        )
    }
}

export default ChatMessage;
