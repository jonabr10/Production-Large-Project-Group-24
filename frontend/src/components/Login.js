import React, { Component } from "react";
import './css/LoginAndSignup.css';
import { Modal } from 'antd';

export default class Login extends Component {
    constructor(props)
    {
        super(props);
        this.state = 
        {
            username: '',
            password: ''
        }
    }

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
    }

    doLogin = () =>
    {
        if (this.areFieldsValid())
        {
            alert('hi');
        }

        // Check response to ensure its a valid user
    }

    areFieldsValid = () => 
    {
        if (!this.areAllFieldsFilled())
        {
            this.showErrorMessage('Empty login information', 'Please fill out all the information.');
            return false;
        }

        return true;
    }

    areAllFieldsFilled = () => 
    {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    showErrorMessage = (title, message) =>
    {
        Modal.error
        ({
            title: title,
            content: message,
        });
    }

    render() {
        return (    
            <form>
                <h3>Log in</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" placeholder="Enter username" maxLength="50" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Enter password" maxLength="50" onChange={this.handleInputChange} />
                </div>
                
                <br></br>
                <button type="button" className="btn btn-dark btn-lg btn-block" onClick={() => this.doLogin()}>Sign in</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        );
    }
}