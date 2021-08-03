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
            desiredWeight: 0,
            startingWeight: 0,
            isEditing: false
        }

        localStorage.setItem('weight', this.props.userData.weight.toString()); 
        localStorage.setItem('desired_weight', this.props.userData.desiredWeight.toString()); 
        localStorage.setItem('starting_weight', this.props.userData.startingWeight.toString()); 
    }

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
    }

    createStartingWeight = () =>
    {
        if (this.isStartingWeightValid())
        {
            let pathBuilder = require('../Path');
            let tokenStorage = require('../tokenStorage');
    
            let addWeightPayload = 
            {
                userId: this.props.userData.id,
                weight: this.getWeight(),
                desiredWeight: this.getDesiredWeight(),
                startingWeight: parseInt(this.state.startingWeight),
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
                    this.clearEditFields();
                    this.updateStartingWeight(addWeightPayload.startingWeight);
                    this.stopEditing();
                    this.showNotification('success', 'Successfully updated starting weight!');
                }
                else
                {
                    this.showNotification('error', responseData.error);
                }
            });
        }
    }

    isStartingWeightValid = () => 
    {
        let validFlag = true;

        if (this.state.startingWeight <= 0)
        {
            const element = <Alert message= "Please input a valid weight" banner />;
            ReactDOM.render(element, document.getElementById('invalidStartingWeightAlert'));

            validFlag = false;
        }
        else
        {
            const element = '';
            ReactDOM.render(element, document.getElementById('invalidStartingWeightAlert'));
        }
        
        return validFlag;
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
                startingWeight: this.getStartingWeight(),
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
                startingWeight: this.getStartingWeight(),
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

    getStartingWeightRender = () => 
    {
        let records = this.getStartingWeight();

        if (this.state.isEditing)
        {
            const element = (
                <div>
                    <label>Update starting weight</label>
                    <input type="number" id="startingWeight" name="startingWeight" className="form-control" placeholder="Starting weight (lb)" min="0" onChange={this.handleInputChange} />

                    <a 
                    href="javascript:;"
                    onClick={ () => this.createStartingWeight() }
                    className="save-cancel-button"
                    >
                        Save
                    </a>

                    <a 
                    href="javascript:;"
                    onClick={ () => this.stopEditing() }
                    className="save-cancel-button"
                    >
                        Cancel
                    </a>
                    <div id="invalidStartingWeightAlert"></div>
                </div>);
            
            return element;
        }
        else
        {
            const element = (
                <div>
                    <Statistic title="Starting weight" value={records} /> 
                    <a 
                    href="javascript:;"
                    onClick={ () => this.startEditing() }
                    className="weight-edit-button"
                    >
                    Edit
                    </a>
                </div>);
            
            return element;
        } 
    }

    getStartingWeight = () => 
    {
        let records = parseInt(localStorage.getItem('starting_weight'));
        
        return records;
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

    updateStartingWeight = (newWeight) => 
    {      
        localStorage.setItem('starting_weight', newWeight.toString());
        this.setState(this.state);
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
    
    getPercentageDifference = (startingWeight, currentWeight, desiredWeight) => 
    {
        let diff1 = Math.abs(startingWeight - desiredWeight);
        let diff2 = Math.abs(startingWeight - currentWeight);
        let percentage = Math.round(diff2 / diff1 * 100);

        return percentage;
    }

    setEditing = (isEditing) => 
    {
        this.setState({ isEditing: isEditing });
    }

    startEditing = () => 
    {
        if (this.state.isEditing)
        {
            this.stopEditing();
        }

        this.setEditing(true);
    }

    stopEditing = () => 
    {
        this.setEditing(false);
        this.clearEditFields();
    }

    clearEditFields = () =>
    {
        let weightRef =  document.getElementById('startingWeight');
        if (weightRef != null) weightRef.value = '';
        
        this.setState
        ({ 
            startingWeight: ''
        });
    }

    render()
    {
        const startingWeight = this.getStartingWeightRender();
        const currentWeight = this.getWeight();
        const desiredWeight = this.getDesiredWeight();
        const goalPercentage = this.getPercentageDifference(this.getStartingWeight(), currentWeight, desiredWeight);
        
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
                            <p>Weight goal progress to {desiredWeight} lbs</p>
                            <Progress type="circle" percent={goalPercentage} width={90} />
                        </div>
                        <Divider></Divider>
                        <div>
                            {startingWeight}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WeightTrack;