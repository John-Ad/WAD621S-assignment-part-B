//###############################
//      REACT IMPORTS
//###############################

import React from "react";


//###############################
//      CSS IMPORTS
//###############################

import "./header.css";


//###############################
//      INTERFACE DEFINITIONS
//###############################

interface IProps {
    logout(): void
}


//###############################
//      CLASS DEFINITION
//###############################

class Header extends React.Component<IProps> {
    render() {
        return (
            <div id="header-container" className="flex-row">
                <h1>NUST Chat Room</h1>
                <div className="flex-row" onClick={this.props.logout}>
                    <h3>Log Out</h3>
                </div>
            </div>
        )
    }
}

export default Header;
