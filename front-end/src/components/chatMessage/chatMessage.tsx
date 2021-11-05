//###############################
//      REACT IMPORTS
//###############################

import React from "react";


//###############################
//      INTERFACE IMPORTS
//###############################

import { IDeleteMessage, IEditMessage, IMessageByTopic, IResponse } from "../../../../back-end/src/interfaces";
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

interface IState {
    editing: boolean,
    inEdit: string,
    textareaRef: React.RefObject<HTMLTextAreaElement>
}


//###############################
//      CLASS DEFINITION
//###############################

class ChatMessage extends React.Component<IProps, IState> {

    //###############################
    //      CONSTRUCTOR
    //###############################
    constructor(props: IProps) {
        super(props);

        this.state = {
            editing: false,
            inEdit: this.props.message.Content,
            textareaRef: React.createRef()
        }
    }

    //###############################
    //      COMP DID MOUNT
    //###############################
    componentDidMount() {
        this.state.textareaRef.current.style.height = "";
        this.state.textareaRef.current.style.height = this.state.textareaRef.current.scrollHeight + "px";
    }

    //###############################
    //      COMP DID UPDATE
    //###############################
    componentDidUpdate(prevProps: IProps, prevState: IState) {
        if (this.state.inEdit !== prevState.inEdit) {
            this.state.textareaRef.current.style.height = "";
            this.state.textareaRef.current.style.height = this.state.textareaRef.current.scrollHeight + "px";
        }

        if (!this.state.editing && prevProps.message.Content !== this.props.message.Content) {
            this.setState({ inEdit: this.props.message.Content });
        }
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


    //###############################
    //      EDIT MESSAGE
    //###############################
    editMessage = async () => {
        if (this.state.inEdit != "") {
            let data: IEditMessage = {
                topicName: this.props.topicName,
                messageID: this.props.message.MessageID,
                content: this.state.inEdit
            }

            let response: IResponse = await Connection.postReq(REQS.EDIT_MESSAGE, data);

            if (response.stat != "ok") {
                alert(response.data);
            }

            this.setState({ editing: false });
            return;
        }
        alert("enter a message");
    }


    //###############################
    //      RENDER FUNCTION
    //###############################
    render() {
        return (
            <div id="chat-message" className="flex-column center" style={{ backgroundColor: (this.props.message.Username === this.props.username) ? "#D2D2D2" : "#E2E2E2" }}>
                <div id="message-header" className="flex-row">

                    {
                        //###############################
                        //      EDITED TAG
                        //###############################
                        this.props.message.Edited === 1 &&
                        <p>(edited)</p>
                    }

                    <p style={{ color: "#5555FF" }}>{this.props.message.Username}</p>
                    <p style={{ color: "#5555FF" }}>{this.props.message.Date_Added.replace(/T|.000|Z/gi, " ")}</p>

                    {
                        //###############################
                        //      DELETE BUTTON
                        //###############################
                        this.props.message.Username === this.props.username &&
                        <div id="message-delete" onClick={this.deleteMessage} className="flex-row">
                            <p className="center">Delete</p>
                        </div>
                    }
                    {
                        //###############################
                        //      EDIT BUTTON
                        //###############################
                        this.props.message.Username === this.props.username &&
                        <div id="message-edit" onClick={() => {
                            this.setState({ editing: true }, () => {
                                this.state.textareaRef.current.focus();
                            });
                        }} className="flex-row">
                            <p className="center">Edit</p>
                        </div>
                    }
                </div>

                <textarea ref={this.state.textareaRef} disabled={this.state.editing ? false : true} className="center" onChange={ev => this.setState({ inEdit: ev.target.value })} value={this.state.inEdit} />

                {
                    //###################################
                    //      SAVE/CANCEL EDIT BUTTONS
                    //###################################
                    this.state.editing &&
                    <div className="center flex-row">
                        <div id="message-save-edit" className="center flex-row" onClick={this.editMessage}>
                            <p className="center">Save</p>
                        </div>
                        <div id="message-save-edit" className="center flex-row" onClick={() => {
                            this.setState({ editing: false, inEdit: "" });
                        }}>
                            <p className="center">Cancel</p>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default ChatMessage;
