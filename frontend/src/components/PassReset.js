import React, { Component } from "react";
import ReactDOM from "react-dom";
import './css/Menu.css';
import { Alert, notification, Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

export default class PassReset extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            oldPassword: '',
            newPassword: ''
        }
    }

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
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
            <div class="pass-reset">
                <div class="inner">
                    <div className="form-group">
                        <label>Alarm Name</label>
                        <input type="text" id="alarmName" name="alarmName" className="form-control" placeholder="Describe this alarm" maxLength="50" onChange={this.handleInputChange} />
                    </div>
                    <br></br>
                    <Button type="default" shape="square" size="small" icon={<ClockCircleOutlined />} onClick={() => { this.doCreate(); }}> Create Alarm </Button>
                    <div id="invalidFieldsAlert"></div>
                </div>
            </div>
        );
    }
}