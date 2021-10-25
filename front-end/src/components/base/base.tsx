//###############################
//      REACT IMPORTS
//###############################

import React from "react";


//###############################
//      COMPONENT IMPORTS
//###############################

import ChatSection from "../chatSection/chatSection";
import AccountSection from "../accountSection/accountSection";
import Header from "../header/header";


//###############################
//      CSS IMPORTS
//###############################

import "./base.css";


//###############################
//      SECTIONS ENUM
//###############################

enum SECTION {
    ACCOUNT,
    CHAT
}


//###############################
//      STATE/PROPS
//###############################

interface IState {
    section: SECTION
}


//###############################
//      CLASS DEFINITION
//###############################

class Base extends React.Component<{}, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            section: SECTION.CHAT
        }
    }

    render() {
        return (
            <div id="main-container" className="flex-column">

                {

                    //###############################
                    //      HEADER
                    //###############################

                    <Header />

                }


                {

                    //###############################
                    //      CHAT SECTION
                    //###############################

                    this.state.section === SECTION.CHAT &&

                    <ChatSection />
                }


                {

                    //###############################
                    //      ACCOUNT SECTION
                    //###############################

                    this.state.section === SECTION.ACCOUNT &&

                    <AccountSection />
                }

            </div>
        )
    }
}

export default Base;
