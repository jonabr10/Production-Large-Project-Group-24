import React, { Component } from "react";
import ReactDOM from "react-dom";
import './css/Menu.css';
import { Alert, notification, Button, Tooltip } from 'antd';
import './css/Search.css';

export default class PassReset extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            email: '',
        }
    }

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
    }
    
    doSendEmail = () =>
    {        
        if (this.areFieldsValid())
        {
            let pathBuilder = require('../Path');
            
            let sendEmailPayload = 
            {
                email: this.state.email
            }
            
            let httpRequest = 
            {
                method: 'post',
                body: JSON.stringify(sendEmailPayload),
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
            
            fetch(pathBuilder.buildPath('api/passwordResetOutgoing'), httpRequest)
            .then(this.checkResponse)
            .catch(function(error) { console.log(error); })
            .then(response => response.json())
            .then(responseData =>
            {
                if (responseData.error.length === 0)
                {
                    this.clearAllFields();
                    this.showNotification('success', 'Check your email to reset your password!');

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
        
        return validFlag;
    }

    areAllFieldsFilled = () => 
    {
        return this.state.email.length > 0;
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

    isValidEmail = () => 
    {
        let validatingEmailCharacters = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        return validatingEmailCharacters.test(this.state.email);
    }

    clearAllFields = () =>
    {
        document.getElementById('email').value = '';
        
        this.setState
        ({ 
            email: ''
        });
    }

    render() {
        return (   
            <div class="pass-reset">
                <div class="inner">
                    <div className="form-group">
                        <label>Email</label>
                        <Tooltip placement="topLeft" title={"If this user's email exists, we'll send an email to reset the password."}>
                            <a href="javascript:;" className="save-cancel-button">(?)</a>
                        </Tooltip>
                        <input type="email" id="email" name="email" className="form-control" placeholder="Confirm email" maxLength="50" onChange={this.handleInputChange} />
                        <div id="invalidEmailAlert"></div>
                    </div>
                    
                    <br></br>

                    <Button type="primary" shape="round" size="medium" onClick={() => { this.doSendEmail(); }}> Submit </Button>
                    <div id="invalidFieldsAlert"></div>
                    <div id="redirectUser"></div>
                </div>
            </div>
        );
    }
}