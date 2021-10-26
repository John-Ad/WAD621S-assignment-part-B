//###############################
//      REACT IMPORTS
//###############################

import React from "react";
import { IAddUser, ILogin, IResponse } from "../../../../back-end/src/interfaces";

import Connection, { REQS } from "../../connection";

//###############################
//      CSS IMPORTS
//###############################

import "./loginRegistration.css";


//###############################
//      STATE/PROPS
//###############################
enum SECTION {
    LOGIN,
    REGISTRATION
}

interface IState {
    section: SECTION,
    inUsername: string,
    inPassword: string,
    inEmail: string
}

interface IProps {
    setDetails(uname: string): void
}


//###############################
//      CLASS DEFINITION
//###############################

class LoginReg extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            inEmail: "",
            inPassword: "",
            inUsername: "",
            section: SECTION.LOGIN
        }
    }

    validateInput = (): boolean => {
        if (this.state.inUsername === "") {
            alert("enter a username");
            return false;
        }
        if (this.state.inPassword === "") {
            alert("enter a password");
            return false;
        }
        if (this.state.inEmail === "" && this.state.section === SECTION.REGISTRATION) {
            alert("enter a username");
            return false;
        }
        return true;
    }

    register = async () => {
        if (this.validateInput()) {
            let data: IAddUser = {
                username: this.state.inUsername,
                password: this.state.inPassword,
                email: this.state.inEmail
            }

            let response: IResponse = await Connection.postReq(REQS.ADD_USER, data);

            if (response.stat != "ok") {
                alert(response.data);
                return;
            }

            this.props.setDetails(data.username);
        }
    }

    login = async () => {
        if (this.validateInput()) {
            let data: ILogin = {
                username: this.state.inUsername,
                password: this.state.inPassword
            }

            let response: IResponse = await Connection.postReq(REQS.LOGIN, data);

            if (response.stat != "ok") {
                alert(response.data);
                return;
            }

            this.props.setDetails(data.username);
        }
    }

    render() {
        return (
            <div id="login-container" className="center flex-column">

                <h4>Username</h4>
                <input type="text" onChange={(ev) => this.setState({ inUsername: ev.target.value })} />
                <h4>Password</h4>
                <input type="text" onChange={(ev) => this.setState({ inPassword: ev.target.value })} />

                {
                    this.state.section === SECTION.REGISTRATION &&
                    <React.Fragment>
                        <h4>Email</h4>
                        <input type="text" onChange={(ev) => this.setState({ inEmail: ev.target.value })} />
                    </React.Fragment>
                }

                <div id="login-button" className="center flex-row" onClick={(this.state.section === SECTION.LOGIN ? this.login : this.register)}>
                    <h3 className="center" >{this.state.section === SECTION.LOGIN ? "Login" : "Register"}</h3>
                </div>

                <div id="section-change" className="center">
                    {
                        this.state.section === SECTION.LOGIN &&
                        <p onClick={() => this.setState({ section: SECTION.REGISTRATION })}>register</p>
                    }
                    {
                        this.state.section === SECTION.REGISTRATION &&
                        <p onClick={() => this.setState({ section: SECTION.LOGIN })}>login</p>
                    }
                </div>
            </div >
        )
    }
}

export default LoginReg;
