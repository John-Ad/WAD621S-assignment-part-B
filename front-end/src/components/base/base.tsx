//###############################
//      REACT IMPORTS
//###############################

import React from "react";


//###############################
//      COMPONENT IMPORTS
//###############################

import ChatSection from "../chatSection/chatSection";
import Header from "../header/header";


//###############################
//      CSS IMPORTS
//###############################

import "./base.css";
import LoginReg from "../loginRegistrationSection/loginRegistration";


//###############################
//      SECTIONS ENUM
//###############################

enum SECTION {
    LOGIN,
    CHAT
}


//###############################
//      STATE/PROPS
//###############################

interface IState {
    section: SECTION,
    username: string
}


//###############################
//      CLASS DEFINITION
//###############################

class Base extends React.Component<{}, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            section: SECTION.LOGIN,
            username: ""
        }
    }

    setDetails = (uname: string) => {
        this.setState({ username: uname, section: SECTION.CHAT });
    }

    logout = () => {
        this.setState({ username: "", section: SECTION.LOGIN })
    }

    render() {
        return (
            <div id="main-container" className="flex-column">

                {

                    //###############################
                    //      HEADER
                    //###############################

                    <Header logout={this.logout} />

                }

                {

                    //###############################
                    //      LOGIN/REGISTRATION
                    //###############################

                    this.state.section === SECTION.LOGIN &&
                    <LoginReg setDetails={this.setDetails} />

                }

                {

                    //###############################
                    //      CHAT SECTION
                    //###############################

                    this.state.section === SECTION.CHAT &&

                    <ChatSection username={this.state.username} />
                }

            </div>
        )
    }
}

export default Base;
