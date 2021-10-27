//###############################
//      REACT IMPORTS
//###############################

import React from "react";


//###############################
//      COMPONENT IMPORTS
//###############################

import ChatMessage from "../chatMessage/chatMessage";


//###############################
//      INTERFACE IMPORTS
//###############################

import { IAddMessage, IAddTopic, IAllTopics, IGetAllTopics, IMessageByTopic, IResponse } from "../../../../back-end/src/interfaces";


//###############################
//      CSS IMPORTS
//###############################

import "./chatSection.css";
import Connection, { REQS, ChatWS } from "../../connection";


//###############################
//      STATE/PROPS
//###############################

interface IState {
    webSock: ChatWS,

    messages: IMessageByTopic[],
    topics: IAllTopics[],
    messageContainerHeight: number,

    currentTopic: string,

    inTopic: string,
    inMessage: string
}
interface IProps {
    username: string
}


//###############################
//      CLASS DEFINITION
//###############################

class ChatSection extends React.Component<IProps, IState> {

    //###############################
    //      CONSTRUCTOR
    //###############################
    constructor(props: IProps) {
        super(props);

        this.state = {
            webSock: null,
            currentTopic: "",
            inTopic: "",
            inMessage: "",
            messages: [],
            topics: [],
            messageContainerHeight: 0
        }
    }


    //###############################
    //      COMPONENT DID MOUNT
    //###############################
    componentDidMount() {
        let mxMsgH = window.innerHeight - 90;
        this.setState({ messageContainerHeight: mxMsgH });
        this.getAllTopics();
    }


    //###############################
    //      ADD TOPIC
    //###############################
    addTopic = async () => {
        if (this.state.inTopic != "") {

            let data: IAddTopic = {
                name: this.state.inTopic,
                username: this.props.username
            }

            let result: IResponse = await Connection.postReq(REQS.ADD_TOPIC, data);

            if (result.stat != "ok") {
                alert("failed to add topic: " + result.data);
                return;
            }

            alert("topic successfully added");
            this.setState({ inTopic: "" });
            this.getAllTopics();
            return;

        }
        alert("enter a topic");
    }


    //###############################
    //      GET ALL TOPICS
    //###############################
    getAllTopics = async () => {
        let data: IGetAllTopics = {}
        let response: IResponse = await Connection.getReq(REQS.GET_ALL_TOPICS, data);

        if (response.stat === "ok") {
            this.setState({ topics: response.data });
        } else {
            this.setState({ topics: [] });
        }
    }


    //###############################
    //      CHANGE TOPIC
    //###############################
    changeTopic = (topic: string) => {
        if (this.state.webSock) {
            this.state.webSock.disconnect();
        }
        this.setState({ currentTopic: topic, messages: [] });
        this.setState({ webSock: new ChatWS(topic, this.appendMessage, this.removeMessage) })
    }


    //###############################
    //      APPEND MESSAGE
    //###############################
    appendMessage = async (message: IMessageByTopic) => {
        let messages = this.state.messages.slice();
        messages.push(message);
        this.setState({ messages: messages });
    }


    //###############################
    //      REMOVE MESSAGE
    //###############################
    removeMessage = async (messageToRem: number) => {
        let messages = this.state.messages.slice();
        messages = messages.filter(m => m.MessageID != messageToRem);   // REMOVE MESSAGE WITH ID OF messageToRem
        this.setState({ messages: messages });
    }


    //###############################
    //      ADD MESSAGE
    //###############################
    addMessage = async () => {
        if (this.state.currentTopic === "") {
            alert("no topic chosen");
            return;
        }

        if (this.state.inMessage !== "") {
            let data: IAddMessage = {
                username: this.props.username,
                topicName: this.state.currentTopic,
                content: this.state.inMessage
            }

            let response: IResponse = await Connection.postReq(REQS.ADD_MESSAGE, data);

            if (response.stat != "ok") {
                alert(response.data);
                return;
            }

            this.setState({ inMessage: "" });
        } else {
            alert("no message entered");
        }
    }

    //###############################
    //      RENDER METHOD
    //###############################
    render() {
        return (
            <div id="chat-section-container">

                {
                    //###############################
                    //      TOPICS LIST
                    //###############################
                }
                <div id="topics-section" className="flex-column">

                    <div id="topics-title" className="center flex-row">
                        <h3 className="center">Topics</h3>
                    </div>

                    <div id="topics-list" className="center">
                        <div>

                            {
                                //###############################
                                //      LIST ALL TOPICS
                                //###############################
                                this.state.topics.map(topic => {
                                    return (
                                        <h3 className="topic-item center" onClick={() => this.changeTopic(topic.TopicName)}>
                                            {topic.TopicName}
                                        </h3>
                                    )
                                })
                            }

                            {
                                //###############################
                                //      DISPLAY NO TOPICS MSG
                                //###############################
                                this.state.topics.length === 0 &&
                                <h3>
                                    No topics available
                                </h3>
                            }

                        </div>
                    </div>

                    <div id="topic-add-container" className="center flex-row">
                        <input type="text" onChange={ev => this.setState({ inTopic: ev.target.value })} />
                        <div className="flex-row" onClick={this.addTopic}>
                            <p>Add</p>
                        </div>
                    </div>

                </div>

                {
                    //###############################
                    //      MESSAGING SECTION
                    //###############################
                }
                <div id="message-section-container" style={{ maxHeight: this.state.messageContainerHeight }}>

                    <div id="messages-container" className="max-size flex-column">
                        {
                            this.state.messages.map(message => {
                                return (
                                    <ChatMessage message={message} username={this.props.username} topicName={this.state.currentTopic} />
                                )
                            })
                        }

                        {
                            this.state.messages.length === 0 &&
                            <h3 className="center">No messages</h3>
                        }
                    </div>

                    <div id="send-message-container" className="max-size flex-row">
                        <textarea value={this.state.inMessage} onChange={ev => this.setState({ inMessage: ev.target.value }, () => console.log(this.state.inMessage))} />

                        <div onClick={this.addMessage}>
                            <h3 className="center">Send</h3>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}

export default ChatSection;
