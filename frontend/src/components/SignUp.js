import React, { Component } from "react";
import ReactDOM from "react-dom";
import './css/LoginAndSignup.css';
import { Modal, Alert } from 'antd';

export default class SignUp extends Component {
    constructor(props)
    {
        super(props);
        this.state = 
        {
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        }
    }

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
    }
    
    doRegistration = () =>
    {        
        if (this.areFieldsValid())
        {
            alert('hi');

            // Check response to ensure user doesn't already exist
        }
    }
    
    areFieldsValid = () => 
    {
        let validFlag = true;

        if (!this.areAllFieldsFilled())
        {
            const element = <Alert message= "Please fill out all information." banner />;
            ReactDOM.render(element, document.getElementById('invalidFieldsAlert'));

            validFlag = false;
        }
        else
        {
            const element = '';
            ReactDOM.render(element, document.getElementById('invalidFieldsAlert'));
        }

        if (!this.isValidEmail())
        {
            const element = <Alert message= "Please enter a valid email." banner />;
            ReactDOM.render(element, document.getElementById('invalidEmailAlert'));

            validFlag = false;
        }
        else
        {
            const element = '';
            ReactDOM.render(element, document.getElementById('invalidEmailAlert'));
        }
        
        if (!this.arePasswordsMatching())
        {
            const element = <Alert message= "Please ensure passwords are matching." banner />;
            ReactDOM.render(element, document.getElementById('invalidPasswordAlert'));

            validFlag = false;
        }
        else
        {
            const element = '';
            ReactDOM.render(element, document.getElementById('invalidPasswordAlert'));
        }
        
        return validFlag;
    }

    areAllFieldsFilled = () => 
    {
        return this.state.firstName.length > 0 && this.state.lastName.length > 0 && this.state.email.length > 0 && 
            this.state.username.length > 0 && this.state.password.length > 0 && this.state.confirmPassword.length > 0;
    }

    isValidEmail = () => 
    {
        let validatingEmailCharacters = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        return validatingEmailCharacters.test(this.state.email);
    }

    arePasswordsMatching = () => 
    {
        return this.state.password === this.state.confirmPassword;
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
                <h3>Register</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" name="firstName" className="form-control" placeholder="First name" maxLength="50" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" name="lastName" className="form-control" placeholder="Last name" maxLength="50" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" placeholder="Enter email" maxLength="50" onChange={this.handleInputChange} />
                    <div id="invalidEmailAlert"></div>
                </div>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" placeholder="Enter username" maxLength="50" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Enter password" maxLength="50" onChange={this.handleInputChange} />
                    <div id="invalidPasswordAlert"></div>
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm password" maxLength="50" onChange={this.handleInputChange} />
                </div>

                <br></br>
                <button type="button" className="btn btn-dark btn-lg btn-block" onClick={() => this.doRegistration()}>Register</button>
                <div id="invalidFieldsAlert"></div>

                <p className="forgot-password text-right">
                    Already registered <a href="#">log in?</a>
                </p>
            </form>
        );
    }
}