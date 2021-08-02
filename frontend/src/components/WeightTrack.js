import React, { Component } from 'react';
import ReactDOM from "react-dom";
import './css/Menu.css';
import { Divider, Button, Progress, Statistic, Alert, notification } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';

class WeightTrack extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            currentWeight: 0,
            desiredWeight: 0
        }

        localStorage.setItem('weight', this.props.userData.weight.toString()); 
        localStorage.setItem('desired_weight', this.props.userData.desiredWeight.toString()); 
    }

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
    }

    isCurrentWeightValid = () => 
    {
        let validFlag = true;

        if (this.state.currentWeight <= 0)
        {
            const element = <Alert message= "Please input a valid weight" banner />;
            ReactDOM.render(element, document.getElementById('invalidCurrentWeightAlert'));

            validFlag = false;
        }
        else
        {
            const element = '';
            ReactDOM.render(element, document.getElementById('invalidCurrentWeightAlert'));
        }
        
        return validFlag;
    }

    isDesiredWeightValid = () => 
    {
        let validFlag = true;

        if (this.state.desiredWeight <= 0)
        {
            const element = <Alert message= "Please input a valid weight" banner />;
            ReactDOM.render(element, document.getElementById('invalidDesiredWeightAlert'));

            validFlag = false;
        }
        else
        {
            const element = '';
            ReactDOM.render(element, document.getElementById('invalidDesiredWeightAlert'));
        }
        
        return validFlag;
    }

    clearCurrentWeightField = () =>
    {
        document.getElementById('currentWeight').value = '';
        
        this.setState
        ({ 
            currentWeight: 0
        });
    }

    clearDesiredWeightField = () =>
    {
        document.getElementById('desiredWeight').value = '';
        
        this.setState
        ({ 
            desiredWeight: 0
        });
    }

    createCurrentWeight = () =>
    {
        if (this.isCurrentWeightValid())
        {
            let pathBuilder = require('../Path');
            let tokenStorage = require('../tokenStorage');
    
            let addWeightPayload = 
            {
                userId: this.props.userData.id,
                weight: parseInt(this.state.currentWeight),
                desiredWeight: this.getDesiredWeight(),
                jwtToken: tokenStorage.retrieveToken()
            } 

            let httpRequest = 
            {
                method: 'post',
                body: JSON.stringify(addWeightPayload),
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
            
            fetch(pathBuilder.buildPath('api/addWeight'), httpRequest)
            .then(this.checkResponse)
            .catch(function(error) { console.log(error); })
            .then(response => response.json())
            .then(responseData =>
            {
                if (responseData.error.length === 0)
                {
                    tokenStorage.storeToken(responseData.jwtToken);
                    this.clearCurrentWeightField();
                    this.updateWeight(addWeightPayload.weight);
                    this.showNotification('success', 'Successfully updated weight!');
                }
                else
                {
                    this.showNotification('error', responseData.error);
                }
            });
        }
    }

    createDesiredWeight = () =>
    {
        if (this.isDesiredWeightValid())
        {
            let pathBuilder = require('../Path');
            let tokenStorage = require('../tokenStorage');
    
            let addWeightPayload = 
            {
                userId: this.props.userData.id,
                weight: this.getWeight(),
                desiredWeight: parseInt(this.state.desiredWeight),
                jwtToken: tokenStorage.retrieveToken()
            }  

            let httpRequest = 
            {
                method: 'post',
                body: JSON.stringify(addWeightPayload),
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
            
            fetch(pathBuilder.buildPath('api/addWeight'), httpRequest)
            .then(this.checkResponse)
            .catch(function(error) { console.log(error); })
            .then(response => response.json())
            .then(responseData =>
            {
                if (responseData.error.length === 0)
                {
                    tokenStorage.storeToken(responseData.jwtToken);
                    this.clearDesiredWeightField();
                    this.updateDesiredWeight(addWeightPayload.desiredWeight);
                    this.showNotification('success', 'Successfully updated weight goal!');
                }
                else
                {
                    this.showNotification('error', responseData.error);
                }
            });
        }
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

    checkResponse = (response) =>
    {
        if (response.status >= 500)
        {
            this.showNotification('error', 'Server Error: Did not get a valid response from server!');
            throw new Error('Invalid JSON from server - probably a server error');
        }

        return response;
    }

    getWeight = () => 
    {
        let records = parseInt(localStorage.getItem('weight'));
        
        return records;
    }

    getDesiredWeight = () => 
    {
        let records = parseInt(localStorage.getItem('desired_weight'));
        
        return records;
    }

    updateWeight = (newWeight) => 
    {      
        localStorage.setItem('weight', newWeight.toString());
        this.setState(this.state);
    }

    updateDesiredWeight = (newWeight) => 
    {
        localStorage.setItem('desired_weight', newWeight.toString());
        this.setState(this.state);
    }
    
    getPercentageDifference = (currentWeight, desiredWeight) => 
    {
        
    }

    render()
    {
        const currentWeight = this.getWeight();
        const desiredWeight = this.getDesiredWeight();
        const goalPercentage = Math.round((currentWeight / desiredWeight) * 100);
        
        return (
            <div class="grid-container">   
                <div>
                    <br></br>
                    <h3>Weight Tracking</h3>
                    <Divider>Set your weight goals</Divider>
                </div>

                <div class="float-left">
                    <div class="inner">
                        <div className="form-group">
                            <label>Update current weight</label>
                            <input type="number" id="currentWeight" name="currentWeight" className="form-control" placeholder="Current weight (lb)" min="0" onChange={this.handleInputChange} />

                            <br></br>

                            <Button type="default" shape="square" size="small" icon={<DashboardOutlined />} onClick={() => { this.createCurrentWeight(); }}> Create current weight </Button>
                            <div id="invalidCurrentWeightAlert"></div>
                        </div>
                        <Divider></Divider>
                        <div>
                            <label>Update desired weight</label>
                            <input type="number" id="desiredWeight" name="desiredWeight" className="form-control" placeholder="Desired weight (lb)" min="0" onChange={this.handleInputChange} />
                            
                            <br></br>

                            <Button type="default" shape="square" size="small" icon={<DashboardOutlined />} onClick={() => { this.createDesiredWeight(); }}> Create desired weight </Button>
                            <div id="invalidDesiredWeightAlert"></div>
                        </div>
                    </div>
                </div>

                <div class="float-right">
                    <div class="inner">
                        <div>
                            <p>Weight goal progress</p>
                            <Progress type="circle" percent={goalPercentage} />
                        </div>
                        <Divider></Divider>
                        <div>
                            <Statistic title="Current weight" value={currentWeight} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WeightTrack;