//###############################
//      REACT IMPORTS
//###############################

import React from "react";


//###############################
//      INTERFACE IMPORTS
//###############################

import { IMessageByTopic } from "../../../../back-end/src/interfaces";


//###############################
//      CSS IMPORTS
//###############################

import "./chatMessage.css";


//###############################
//      STATE/PROPS
//###############################

interface IProps {
    message: IMessageByTopic
}


//###############################
//      CLASS DEFINITION
//###############################

class ChatMessage extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div id="chat-message" className="flex-column center">
                <div id="message-header" className="flex-row">
                    <p>{this.props.message.Username}</p>
                    <p>{this.props.message.Date_Added}</p>
                </div>

                <div id="message-content" className="center">
                    <p>{this.props.message.Content}</p>
                </div>
            </div>
        )
    }
}

export default ChatMessage;
