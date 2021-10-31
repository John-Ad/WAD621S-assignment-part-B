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

import { IAddMessage, IAddTopic, IAllTopics, IEditMessage, IGetAllTopics, IGetMessagesByTopic, IMessageByTopic, IResponse, ISearchMessages, ISearchTopics } from "../../../../back-end/src/interfaces";


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
    topicListHeight: number,

    currentTopic: string,

    inTopic: string,
    inTopicSearch: string,
    inMessage: string,
    inMessageSearch: string

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
            inTopicSearch: "",
            inMessage: "",
            inMessageSearch: "",
            messages: [],
            topics: [],
            messageContainerHeight: 0,
            topicListHeight: 0
        }
    }


    //###############################
    //      COMPONENT DID MOUNT
    //###############################
    componentDidMount() {
        let mxTLH = Math.floor((window.innerHeight - 90) * 0.6);
        let mxMsgH = window.innerHeight - 90;
        this.setState({ messageContainerHeight: mxMsgH, topicListHeight: mxTLH });
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
    //      SEARCH TOPICS
    //###############################
    searchTopics = async () => {
        if (this.state.inTopicSearch !== "") {
            let data: ISearchTopics = {
                searchTerm: this.state.inTopicSearch
            }
            let response: IResponse = await Connection.getReq(REQS.SEARCH_TOPICS, data);

            if (response.stat === "ok") {
                this.setState({ topics: response.data, inTopicSearch: "" });
            } else {
                this.setState({ topics: [] });
            }
        } else {
            alert("enter a search term");
        }
    }


    //###############################
    //      CHANGE TOPIC
    //###############################
    changeTopic = (topic: string) => {
        if (this.state.webSock) {
            this.state.webSock.disconnect();
        }
        this.setState({ currentTopic: topic, messages: [] }, () => this.getMessagesByTopic());
        this.setState({ webSock: new ChatWS(topic, this.appendMessage, this.removeMessage, this.updateMessage) })
    }


    //###############################
    //      GET MESSAGES BY TOPIC
    //###############################
    getMessagesByTopic = async () => {
        let data: IGetMessagesByTopic = {
            topicName: this.state.currentTopic
        }

        let response: IResponse = await Connection.getReq(REQS.GET_MESSAGES_BY_TOPIC, data);

        if (response.stat != "ok") {
            return;
        }

        this.setState({ messages: response.data }, () => {
            let elem = document.getElementById("messages-container");
            elem.scrollTop = elem.scrollHeight;
        });
    }


    //###############################
    //      SEARCH MESSAGES
    //###############################
    searchMessages = async () => {
        if (this.state.inMessageSearch !== "") {
            let data: ISearchMessages = {
                topicName: this.state.currentTopic,
                searchTerm: this.state.inMessageSearch
            }

            let response: IResponse = await Connection.getReq(REQS.SEARCH_MESSAGES, data);

            if (response.stat != "ok") {
                this.setState({ messages: [] });
                return;
            }

            this.setState({ messages: response.data, inMessageSearch: "" }, () => {
                let elem = document.getElementById("messages-container");
                elem.scrollTop = elem.scrollHeight;
            });
        } else {
            alert("enter a search term");
        }
    }


    //###############################
    //      APPEND MESSAGE
    //###############################
    appendMessage = async (message: IMessageByTopic) => {
        let messages = this.state.messages.slice();
        messages.push(message);
        this.setState({ messages: messages }, () => {
            let elem = document.getElementById("messages-container");
            elem.scrollTop = elem.scrollHeight;
        });
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
    //      UPDATE MESSAGE
    //###############################
    updateMessage = async (messageToUpdate: IEditMessage) => {
        let updateMessages = [...this.state.messages];

        this.setState({
            messages: updateMessages.map(m => m.MessageID === messageToUpdate.messageID ? { MessageID: m.MessageID, Username: m.Username, Date_Added: m.Date_Added, Edited: 1, Content: messageToUpdate.content } : m)
        });
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
            <div id="chat-section-container" >

                {
                    //###############################
                    //      TOPICS LIST
                    //###############################
                }
                < div id="topics-section" className="flex-column" >

                    <div id="topics-title" className="center flex-row">
                        <h3 className="center">Topics</h3>
                    </div>

                    <div id="topics-list" style={{ maxHeight: this.state.topicListHeight }} className="center">

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

                    <div className="topic-add-container center flex-row">
                        <input value={this.state.inTopicSearch} type="text" onChange={ev => this.setState({ inTopicSearch: ev.target.value })} />
                        <div className="flex-row" onClick={this.searchTopics}>
                            <p>Search</p>
                        </div>
                    </div>

                    <div className="topic-add-container center flex-row">
                        <input value={this.state.inTopic} type="text" onChange={ev => this.setState({ inTopic: ev.target.value })} />
                        <div className="flex-row" onClick={this.addTopic}>
                            <p>Add</p>
                        </div>
                    </div>

                    <div id="show-all-topics" className="flex-row center" onClick={this.getAllTopics}>
                        <p>Show All</p>
                    </div>

                </div>

                {
                    //###############################
                    //      MESSAGING SECTION
                    //###############################
                }
                < div id="message-section-container" style={{ maxHeight: this.state.messageContainerHeight }}>

                    <div id="messages-container" className="max-size flex-column">

                        <div id="choose-topic-msg" className="center flex-row">
                            <h3 className="center">{this.state.currentTopic === "" ? "Choose a topic..." : this.state.currentTopic}</h3>
                        </div>

                        <div className="message-search-container center flex-row">
                            <input value={this.state.inMessageSearch} type="text" onChange={ev => this.setState({ inMessageSearch: ev.target.value })} />
                            <div className="flex-row" onClick={this.searchMessages}>
                                <p className="center">Search</p>
                            </div>
                        </div>

                        {
                            this.state.messages.map(message => {
                                return (
                                    <ChatMessage message={message} username={this.props.username} topicName={this.state.currentTopic} />
                                )
                            })
                        }

                        {
                            (this.state.messages.length === 0 && this.state.currentTopic != "") &&
                            <h3 className="center">No messages</h3>
                        }

                    </div>

                    <div id="send-message-container" className="max-size flex-row">
                        <textarea value={this.state.inMessage} onChange={ev => this.setState({ inMessage: ev.target.value }, () => console.log(this.state.inMessage))} />

                        <div onClick={this.addMessage}>
                            <h3 className="center">Send</h3>
                        </div>
                    </div>

                </div >

            </div >
        )
    }
}

export default ChatSection;
