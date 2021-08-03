import React, { Component } from "react";
import ReactDOM from "react-dom";
import './css/Menu.css';
import { Alert, notification, Button } from 'antd';

export default class PassReset extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            password: '',
            confirmPassword: ''
        }
    }

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
    }
    
    doCreateNewPassword = () =>
    {        
        if (this.areFieldsValid())
        {
            let pathBuilder = require('../Path');
            
            let newPasswordPayload = 
            {
                password: this.state.password,
                uniqueString: this.getUniqueString()
            }
            
            let httpRequest = 
            {
                method: 'post',
                body: JSON.stringify(newPasswordPayload),
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
            
            fetch(pathBuilder.buildPath('api/passwordResetIncoming'), httpRequest)
            .then(this.checkResponse)
            .catch(function(error) { console.log(error); })
            .then(response => response.json())
            .then(responseData =>
            {
                if (responseData.error.length === 0)
                {
                    this.clearAllFields();
                    this.showNotification('success', 'Successfully reset password!');
                    
                    const element = <a href="/sign-in" className="save-cancel-button">Redirect to Login</a>;
                    ReactDOM.render(element, document.getElementById('redirectUser'));
                }
                else
                {
                    this.showNotification('error', responseData.error);
                }
            });
        }
    }

    getUniqueString = () =>
    {
        let urlSplit = window.location.href.split('?');
        let query = urlSplit[1];
        let uniqueString = query.split('=');

        return uniqueString[1];
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
        return this.state.password.length > 0 && this.state.confirmPassword.length > 0;
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
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';
        
        this.setState
        ({ 
            password: '',
            confirmPassword: ''
        });
    }

    render() {
        return (   
            <div class="pass-reset">
                <div class="inner">
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

                    <Button type="primary" shape="round" size="medium" onClick={() => { this.doCreateNewPassword(); }}> Create new password </Button>
                    <div id="invalidFieldsAlert"></div>
                    <div id="redirectUser"></div>
                </div>
            </div>
        );
    }
}