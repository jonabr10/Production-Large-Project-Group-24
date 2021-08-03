import React, { Component } from "react";
import ReactDOM from "react-dom";
import './css/LoginAndSignup.css';
import { Alert, notification } from 'antd';

export default class Login extends Component 
{
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
            let pathBuilder = require('../Path');
            let tokenStorage = require('../tokenStorage');
            
            let loginPayload = 
            {
                login: this.state.username,
                password: this.state.password
            }

            let httpRequest = 
            {
                method: 'post',
                body: JSON.stringify(loginPayload),
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
            
            fetch(pathBuilder.buildPath('api/login'), httpRequest)
            .then(this.checkResponse)
            .catch(function(error) { console.log(error); })
            .then(response => response.json())
            .then(responseData =>
            {
                if (responseData.error.length === 0)
                {
                    let userDataStore = 
                    {
                        id: responseData.id,
                        firstName: responseData.firstName,
                        lastName: responseData.lastName,
                        email: responseData.email,
                        numberHy: responseData.numberHy,
                        numberWorkout: responseData.numberWorkout,
                        numberRx: responseData.numberRx,
                        weight: responseData.weight,
                        desiredWeight: responseData.desiredWeight,
                        currentWeightDifferenceFromGoal: responseData.currentWeightDifferenceFromGoal,
                        startingWeight: responseData.startingWeight
                    }

                    tokenStorage.storeToken(responseData.jwtToken);
                    localStorage.setItem('user_data', JSON.stringify(userDataStore));
                    window.location.href = '/main-page';
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

        return validFlag;
    }

    areAllFieldsFilled = () => 
    {
        return this.state.username.length > 0 && this.state.password.length > 0;
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
                <div id="invalidFieldsAlert"></div>

                <p className="forgot-password text-right">
                    Forgot <a href="/pass-reset-email">password?</a>
                </p>
            </form>
        );
    }
}