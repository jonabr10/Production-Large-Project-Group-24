import React, { Component } from 'react';
import ReactDOM from "react-dom";
import './css/Menu.css';
import { Divider, Button, TimePicker, Statistic, Select, Alert, notification } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import image from './img/workout.png';

class Workouts extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            alarmName: '',
            timeObj:
            {
                time: '',
                timeString: ''
            },
            days: '',
            selectedDays: [],
            selectedTime: null
        }

        localStorage.setItem('workout_records', this.props.userData.numberWorkout.toString());
    }

    handleInputChange = ({ target }) => {
        this.setState({ alarmName: target.value });
    }

    handleTimeInputChange = (time, timeString) => {
        this.setState({ timeObj: { time: time, timeString: timeString } });
        this.setState({ selectedTime: time });
    }

    handleDayInputChange = (days) => {
        this.setState({ days: days });
        this.setState({ selectedDays: days });
    }

    doCreate = () => {
        if (this.areFieldsValid()) {
            let pathBuilder = require('../Path');
            let tokenStorage = require('../tokenStorage');
            let daysOfWeek = this.state.days;

            let addItemPayload =
            {
                userId: this.props.userData.id,
                item: this.state.alarmName,
                workout: true,
                hy: false,
                rx: false,
                waterAmount: 0,
                time: this.state.timeObj.time.toString(),
                monday: daysOfWeek.includes('monday'),
                tuesday: daysOfWeek.includes('tuesday'),
                wednesday: daysOfWeek.includes('wednesday'),
                thursday: daysOfWeek.includes('thursday'),
                friday: daysOfWeek.includes('friday'),
                saturday: daysOfWeek.includes('saturday'),
                sunday: daysOfWeek.includes('sunday'),
                jwtToken: tokenStorage.retrieveToken()
            }

            let httpRequest =
            {
                method: 'post',
                body: JSON.stringify(addItemPayload),
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }

            fetch(pathBuilder.buildPath('api/addItem'), httpRequest)
                .then(this.checkResponse)
                .catch(function (error) { console.log(error); })
                .then(response => response.json())
                .then(responseData => {
                    if (responseData.error.length === 0) {
                        tokenStorage.storeToken(responseData.jwtToken);
                        this.clearAllFields();
                        this.addARecord();
                        this.showNotification('success', 'Successfully created alarm!');
                    }
                    else {
                        this.showNotification('error', responseData.error);
                    }
                });
        }
    }

    clearAllFields = () => {
        document.getElementById('alarmNameW').value = '';
        this.clearSelectedTime();
        this.clearSelectedDays();

        this.setState
            ({
                alarmName: '',
                timeObj:
                {
                    time: '',
                    timeString: ''
                },
                days: ''
            });
    }

    clearSelectedDays = () => {
        this.setState({ selectedDays: [] });
    }

    clearSelectedTime = () => {
        this.setState({ selectedTime: null });
    }

    checkResponse = (response) => {
        if (response.status >= 500) {
            this.showNotification('error', 'Server Error: Did not get a valid response from server!');
            throw new Error('Invalid JSON from server - probably a server error');
        }

        return response;
    }

    showNotification = (notificationType, message) => {
        let config =
        {
            message: message,
            placement: 'bottomLeft'
        };

        if (notificationType === 'success') {
            notification.success(config);
        }

        if (notificationType === 'error') {
            notification.error(config);
        }

        if (notificationType === 'warning') {
            notification.warning(config);
        }
    }

    areFieldsValid = () => {
        let validFlag = true;

        if (!this.areAllFieldsFilled()) {
            const element = <Alert message="Please fill out all information." banner />;
            ReactDOM.render(element, document.getElementById('invalidFieldsAlertW'));

            validFlag = false;
        }
        else {
            const element = '';
            ReactDOM.render(element, document.getElementById('invalidFieldsAlertW'));
        }

        return validFlag;
    }

    areAllFieldsFilled = () => {
        return this.state.alarmName.length > 0 && this.state.timeObj.timeString.length > 0 &&
            this.state.days.length > 0;
    }

    getRecords = () => {
        let records = parseInt(localStorage.getItem('workout_records'));

        return records;
    }

    addARecord = () => {
        let records = parseInt(localStorage.getItem('workout_records'));

        records++;

        localStorage.setItem('workout_records', records.toString());
        this.setState(this.state);
    }

    render() {
        const { Option } = Select;

        const daysOfWeek = [];
        daysOfWeek.push(<Option key={"monday"}>{"Monday"}</Option>);
        daysOfWeek.push(<Option key={"tuesday"}>{"Tuesday"}</Option>);
        daysOfWeek.push(<Option key={"wednesday"}>{"Wednesday"}</Option>);
        daysOfWeek.push(<Option key={"thursday"}>{"Thursday"}</Option>);
        daysOfWeek.push(<Option key={"friday"}>{"Friday"}</Option>);
        daysOfWeek.push(<Option key={"saturday"}>{"Saturday"}</Option>);
        daysOfWeek.push(<Option key={"sunday"}>{"Sunday"}</Option>);

        const numberOfWorkoutAlarms = this.getRecords();

        return (
            <div class="grid-container">
                <div>
                    <br></br>
                    <h3>Workout</h3>
                    <Divider>Create reminders for workouts</Divider>
                </div>

                <div class="float-left">
                    <div class="inner">
                        <div className="form-group">
                            <label>Reminder Name</label>
                            <input type="text" id="alarmNameW" name="alarmNameW" className="form-control" placeholder="Describe this reminder" maxLength="50" onChange={this.handleInputChange} />
                        </div>

                        <div className="form-group">
                            <label>Time</label>
                            <TimePicker use12Hours value={this.state.selectedTime} id="time" name="time" className="form-control time-input" format="h:mm a" placeholder="Select a time" onChange={this.handleTimeInputChange} />
                        </div>

                        <div className="form-group">
                            <label>Days</label>
                            <Select mode="multiple" value={this.state.selectedDays} id="days" name="days" className="days-input" placeholder="Select days for alarm to trigger" onChange={this.handleDayInputChange}>
                                {daysOfWeek}
                            </Select>
                        </div>

                        <br></br>
                        <Button type="default" shape="square" size="small" icon={<ClockCircleOutlined />} onClick={() => { this.doCreate(); }}> Create Reminder </Button>
                        <div id="invalidFieldsAlertW"></div>
                    </div>
                </div>

                <div class="float-right">
                    <div class="inner">
                        <div>
                            <Statistic title="Workout reminders you have set" value={numberOfWorkoutAlarms} />
                        </div>

                        <img src={image} height="47%" width="47%" />

                        <div>
                            Want to manage your reminders? Check out the <a href="/main-page">Health Dashboard!</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Workouts;