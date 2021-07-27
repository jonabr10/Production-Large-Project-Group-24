import React, { Component } from "react";
import ReactDOM from "react-dom";
import './css/LoginAndSignup.css';
import { Alert, notification } from 'antd';

export default class SignUp extends Component 
{
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
            let pathBuilder = require('../Path');
            
            let registerPayload = 
            {
                firstName: this.state.firstName, 
                lastName: this.state.lastName,
                userName: this.state.username,
                password: this.state.password,
                email: this.state.email
            }

            let httpRequest = 
            {
                method: 'post',
                body: JSON.stringify(registerPayload),
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
            
            fetch(pathBuilder.buildPath('api/register'), httpRequest)
            .then(this.checkResponse)
            .catch(function(error) { console.log(error); })
            .then(response => response.json())
            .then(responseData =>
            {
                if (responseData.error.length === 0)
                {
                    this.clearAllFields();
                    this.showNotification('success', 'Successfully created user!');
                }
                else
                {
                    this.showNotification('error', responseData.error);
                }
            });
        }
    }
    
    checkResponse = (response) =>
    {
        if (response.status >= 500)
        {
            this.showNotification('error', 'Server Error: Did not get a valid response from server!');
            throw new Error('Invalid JSON from server - probably a server error');
        }

        return response;
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

    showNotification = (notificationType, message) =>
    {
        let config = 
        {
            message: message,
            placement: 'bottomLeft'
        }; 

        if (notificationType === 'success')
        {
            notification.success(config);
        }

        if (notificationType === 'error')
        {
            notification.error(config);
        }

        if (notificationType === 'warning')
        {
            notification.warning(config);
        }
    }

    clearAllFields = () =>
    {
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';
        
        this.setState
        ({ 
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        });
    }

    render() {
        return (
            <form>
                <h3>Register</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" id="firstName" name="firstName" className="form-control" placeholder="First name" maxLength="50" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" id="lastName" name="lastName" className="form-control" placeholder="Last name" maxLength="50" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" id="email" name="email" className="form-control" placeholder="Enter email" maxLength="50" onChange={this.handleInputChange} />
                    <div id="invalidEmailAlert"></div>
                </div>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" id="username" name="username" className="form-control" placeholder="Enter username" maxLength="50" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" id="password" name="password" className="form-control" placeholder="Enter password" maxLength="50" onChange={this.handleInputChange} />
                    <div id="invalidPasswordAlert"></div>
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" placeholder="Confirm password" maxLength="50" onChange={this.handleInputChange} />
                </div>

                <br></br>
                <button type="button" className="btn btn-dark btn-lg btn-block" onClick={() => this.doRegistration()}>Register</button>
                <div id="invalidFieldsAlert"></div>

                <p className="forgot-password text-right">
                    Already registered <a href="/sign-in">log in?</a>
                </p>
            </form>
        );
    }
}