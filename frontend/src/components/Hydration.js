import React, { Component } from 'react';
import './css/Menu.css';
import { Divider, Button, TimePicker, Statistic, Select, Alert } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

class Hydration extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            alarmName: '',
            timeObj: 
            {
                time: '',
                timeString: ''
            },
            days: ''
        }
    }

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
    }

    handleTimeInputChange = (time, timeString) => 
    {
        this.setState({ timeObj: { time: time, timeString: timeString } });
    }

    handleDayInputChange = (days) => 
    {
        this.setState({ days: days });
    }

    doCreate = () =>
    {
        alert("days: " + this.state.days);
    }

    /*
    {
        "userId": 13,
        "item": "zinc",
        "workout": false,
        "hy": true,
        "rx": true,
        "waterAmount": 8,
        "time": "Mon Jul 19 2021 23:23:55 GMT-0400 (EDT)",
        "monday": true,
        "tuesday": true,
        "wednesday": true,
        "thursday": true,
        "friday": true,
        "saturday": true,
        "sunday": true,
        "jwtToken": "isfi83ri8dldlfsi9"
    }
    */

    render()
    {
        const { Option } = Select;

        const daysOfWeek = [];
        daysOfWeek.push(<Option key={"monday"}>{"Monday"}</Option>);
        daysOfWeek.push(<Option key={"tuesday"}>{"Tuesday"}</Option>);
        daysOfWeek.push(<Option key={"wednesday"}>{"Wednesday"}</Option>);
        daysOfWeek.push(<Option key={"thursday"}>{"Thursday"}</Option>);
        daysOfWeek.push(<Option key={"friday"}>{"Friday"}</Option>);
        daysOfWeek.push(<Option key={"saturday"}>{"Saturday"}</Option>);
        daysOfWeek.push(<Option key={"sunday"}>{"Sunday"}</Option>);

        return (
            <div class="grid-container">   
                <div>
                    <br></br>
                    <h3>Hydration</h3>
                    <Divider>Create alarms for water intake</Divider>
                </div>

                <div class="float-left">
                    <div class="inner">
                        <div className="form-group">
                            <label>Alarm Name</label>
                            <input type="text" id="alarmName" name="alarmName" className="form-control" placeholder="Describe this alarm" maxLength="50" onChange={this.handleInputChange} />
                        </div>
                        
                        <div className="form-group">
                            <label>Time</label>
                            <TimePicker use12Hours id="time" name="time" className="form-control time-input" format="h:mm a" placeholder="Select a time" onChange={this.handleTimeInputChange} />
                        </div>

                        <div className="form-group">
                            <label>Days</label>
                            <Select mode="tags" id="days" name="days" className="days-input" placeholder="Select days for alarm to trigger" onChange={this.handleDayInputChange}>
                                {daysOfWeek}
                            </Select>
                        </div>

                        <br></br>
                        <Button type="deafult" shape="square" size="small" icon={<ClockCircleOutlined />} onClick={() => { this.doCreate(); }}> Create Alarm </Button>
                        <div id="invalidFieldsAlert"></div>
                    </div>
                </div>

                <div class="float-right">
                    <div class="inner">
                        <div>
                            <Statistic title="Hydration alarms you have set" value={112893} />
                        </div>

                        <br></br>

                        <div>
                            Insert water image here
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Hydration;