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

import { IAddTopic, IAllTopics, IGetAllTopics, IMessageByTopic, IResponse } from "../../../../back-end/src/interfaces";


//###############################
//      CSS IMPORTS
//###############################

import "./chatSection.css";
import Connection, { REQS } from "../../connection";


//###############################
//      STATE/PROPS
//###############################

interface IState {
    messages: IMessageByTopic[],
    topics: IAllTopics[],
    messageContainerHeight: number,

    inTopic: string
}
interface IProps {
    username: string
}


//###############################
//      CLASS DEFINITION
//###############################

class ChatSection extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            inTopic: "",
            messages: [
                {
                    MessageID: 1,
                    Username: "john-ad",
                    Edited: 0,
                    Content: "youre a piece of shit \n",
                    Date_Added: null
                },
                {
                    MessageID: 2,
                    Username: "john-ad",
                    Edited: 0,
                    Content: "i hope you die askldjfnjsakldfnkdfnskdjfnjksdnfjsdnnnnnnnnnnnnfjjjjjjfkjsdjfnjkasdfjnjdfjndsjnfjnsjnfjnsdfjnjnsdfjnsdjknjknfjnkasjfdsjnfjdjndjnkfjnsdjfnsjkdnfjkndsfjksdjfjsdnafjnsjdnjsdnjndfjnfjdjfdjdskfnsjadnjsadnfjsdnjdsnfjsdfnjksafnkjanfkajsnfkjsanfkjasnfkjasnfkjsadfnkjsdnf sdfkjnsafkjnf sdfsdjnfjskfnd sfskjdanfksajnfs fsdkjfnsjfnsdf sdkjnfjsdfnsjf sdfkjsf\n",
                    Date_Added: null
                },
                {
                    MessageID: 1,
                    Username: "john-ad",
                    Edited: 0,
                    Content: "youre a piece of shit \n",
                    Date_Added: null
                },
                {
                    MessageID: 2,
                    Username: "john-ad",
                    Edited: 0,
                    Content: "i hope you die askldjfnjsakldfnkdfnskdjfnjksdnfjsdnnnnnnnnnnnnfjjjjjjfkjsdjfnjkasdfjnjdfjndsjnfjnsjnfjnsdfjnjnsdfjnsdjknjknfjnkasjfdsjnfjdjndjnkfjnsdjfnsjkdnfjkndsfjksdjfjsdnafjnsjdnjsdnjndfjnfjdjfdjdskfnsjadnjsadnfjsdnjdsnfjsdfnjksafnkjanfkajsnfkjsanfkjasnfkjasnfkjsadfnkjsdnf sdfkjnsafkjnf sdfsdjnfjskfnd sfskjdanfksajnfs fsdkjfnsjfnsdf sdkjnfjsdfnsjf sdfkjsf\n",
                    Date_Added: null
                }
            ],
            topics: [],
            messageContainerHeight: 0
        }
    }


    componentDidMount() {
        let mxMsgH = window.innerHeight - 90;
        this.setState({ messageContainerHeight: mxMsgH });
        this.getAllTopics();
    }


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

    getAllTopics = async () => {
        let data: IGetAllTopics = {}
        let response: IResponse = await Connection.getReq(REQS.GET_ALL_TOPICS, data);

        if (response.stat === "ok") {
            this.setState({ topics: response.data });
        } else {
            this.setState({ topics: [] });
        }
    }

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
                                        <h3 className="topic-item center">
                                            {topic.Name}
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
                                    <ChatMessage message={message} />
                                )
                            })
                        }

                        {
                            this.state.messages.length === 0 &&
                            <h3 className="center">No messages</h3>
                        }
                    </div>

                    <div id="send-message-container" className="max-size flex-row">
                        <textarea />

                        <div>
                            <h3 className="center">Send</h3>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}

export default ChatSection;
