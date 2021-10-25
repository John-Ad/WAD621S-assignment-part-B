//###############################
//      REACT IMPORTS
//###############################

import React from "react";


//###############################
//      CSS IMPORTS
//###############################

import "./header.css";


//###############################
//      CLASS DEFINITION
//###############################

class Header extends React.Component {
    render() {
        return (
            <div id="header-container" className="flex-row">
                <h1>NUST Chat Room</h1>
                <div className="flex-row">
                    <h3>Account</h3>
                </div>
            </div>
        )
    }
}

export default Header;
