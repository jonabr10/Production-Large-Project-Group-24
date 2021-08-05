import React, { Component } from 'react';
import ReactDOM from "react-dom";
import './css/Search.css';
import { Button, Tooltip, Table, Space, Popconfirm, notification, Select, TimePicker, Alert } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

class Search extends Component {
    constructor(props) {
        super(props);

        this.state =
        {
            search: '',
            dataSource: null,
            editingRecord:
            {
                isEditing: false,
                itemId: ''
            },
            alarmName: '',
            category: '',
            waterAmount: 0,
            timeObj:
            {
                time: '',
                timeString: ''
            },
            days: '',
            selectedDays: [],
            selectedTime: null
        }
    }

    handleInputChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
    }

    handleAlarmInputChange = ({ target }) => {
        this.setState({ alarmName: target.value });
    }

    handleWaterInputChange = ({ target }) => {
        this.setState({ waterAmount: target.value });
    }

    handleTimeInputChange = (time, timeString) => {
        this.setState({ timeObj: { time: time, timeString: timeString } });
        this.setState({ selectedTime: time });
    }

    handleDayInputChange = (days) => {
        this.setState({ days: days });
        this.setState({ selectedDays: days });
    }

    handleCategoryInputChange = (category) => {
        this.setState({ category: category });
    }

    doSearch = () => {
        let pathBuilder = require('../Path');
        let tokenStorage = require('../tokenStorage');

        let searchPayload =
        {
            userId: this.props.userData.id,
            search: this.state.search,
            jwtToken: tokenStorage.retrieveToken()
        }

        let httpRequest =
        {
            method: 'post',
            body: JSON.stringify(searchPayload),
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }

        fetch(pathBuilder.buildPath('api/search'), httpRequest)
            .then(this.checkResponse)
            .catch(function (error) { console.log(error); })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.error.length === 0) {
                    tokenStorage.storeToken(responseData.jwtToken);
                    let results = responseData.results;
                    let dataSource = [];

                    results.forEach(function (result) {
                        let category = result.rx ? 'Prescription' : result.hy ? 'Hydration' : 'Workout';

                        let daysRepeating = [];
                        if (result.alarms[0] != null) {
                            if (result.alarms[0].monday) daysRepeating.push('Monday');
                            if (result.alarms[0].tuesday) daysRepeating.push('Tuesday');
                            if (result.alarms[0].wednesday) daysRepeating.push('Wednesday');
                            if (result.alarms[0].thursday) daysRepeating.push('Thursday');
                            if (result.alarms[0].friday) daysRepeating.push('Friday');
                            if (result.alarms[0].saturday) daysRepeating.push('Saturday');
                            if (result.alarms[0].sunday) daysRepeating.push('Sunday');
                        }

                        let rawTime = result.alarms[0] != null ? result.alarms[0].time : 'No alarm set!'
                        let estTime = null;
                        if (rawTime !== 'No alarm set!') {
                            let timeConverter = require('../TimeConverter');
                            estTime = timeConverter.gmtToEst(rawTime);
                        }

                        let alarmStatus = estTime != null ? `${estTime} (${daysRepeating.join(', ')})` : rawTime;
                        let itemName = result.hy ? `${result.item} (${result.waterAmount} oz)` : result.item;
                        dataSource.push
                            ({
                                itemId: result._id,
                                category: category,
                                description: itemName,
                                alarm: alarmStatus
                            });
                    });

                    this.setState({ dataSource: dataSource });
                }
                else {
                    this.showNotification('warning', responseData.error);
                    this.setState({ dataSource: null });
                }
            });
    }

    doEdit = (record) => {
        if (this.areFieldsValid()) {
            let pathBuilder = require('../Path');
            let tokenStorage = require('../tokenStorage');
            let daysOfWeek = this.state.days;

            let editPayload =
            {
                userId: this.props.userData.id,
                itemId: record.itemId,
                item: this.state.alarmName,
                workout: this.state.category === "workout",
                hy: this.state.category === "hydration",
                rx: this.state.category === "prescription",
                waterAmount: this.state.waterAmount,
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
                body: JSON.stringify(editPayload),
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }

            fetch(pathBuilder.buildPath('api/editItem'), httpRequest)
                .then(this.checkResponse)
                .catch(function (error) { console.log(error); })
                .then(response => response.json())
                .then(responseData => {
                    if (responseData.error.length === 0) {
                        tokenStorage.storeToken(responseData.jwtToken);

                        record.category = this.capitalizeFirstLetter(this.state.category);
                        record.description = this.state.category === "hydration" ? `${this.state.alarmName} (${this.state.waterAmount} oz)` : this.state.alarmName;
                        record.alarm = this.formatTime(this.state.timeObj.timeString, this.state.days);

                        this.stopEditing();
                        this.showNotification('success', 'Successfully created alarm!');

                    }
                    else {
                        this.showNotification('error', responseData.error);
                    }
                });
        }
    }

    doDelete = (itemId) => {
        let pathBuilder = require('../Path');
        let tokenStorage = require('../tokenStorage');

        let deletePayload =
        {
            userId: this.props.userData.id,
            itemObjId: itemId,
            jwtToken: tokenStorage.retrieveToken()
        }

        let httpRequest =
        {
            method: 'post',
            body: JSON.stringify(deletePayload),
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }

        fetch(pathBuilder.buildPath('api/deleteItem'), httpRequest)
            .then(this.checkResponse)
            .catch(function (error) { console.log(error); })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.error.length === 0) {
                    tokenStorage.storeToken(responseData.jwtToken);
                    const dataSource = [...this.state.dataSource];
                    this.setState
                        ({
                            dataSource: dataSource.filter((item) => item.itemId !== itemId),
                        });

                    this.showNotification('success', 'Successfully deleted alarm!');
                }
                else {
                    this.showNotification('error', responseData.error);
                }
            });
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

    isEditing = (itemId) => {
        return this.state.editingRecord.isEditing && this.state.editingRecord.itemId == itemId;
    }

    setEditing = (isEditing, itemId) => {
        this.setState({ editingRecord: { isEditing: isEditing, itemId: itemId } });
    }

    startEditing = (itemId) => {
        if (this.state.editingRecord.isEditing) {
            this.stopEditing();
        }

        this.setEditing(true, itemId);
    }

    stopEditing = () => {
        this.setEditing(false, '');
        this.clearAllFields();
    }

    clearAllFields = () => {
        let alarmRef = document.getElementById('alarmNameT');
        if (alarmRef != null) alarmRef.value = '';

        let waterRef = document.getElementById('waterAmountT');
        if (waterRef != null) waterRef.value = '';

        this.clearSelectedTime();
        this.clearSelectedDays();

        this.setState
            ({
                alarmName: '',
                category: '',
                timeObj:
                {
                    time: '',
                    timeString: ''
                },
                days: '',
                waterAmount: 0
            });
    }

    clearSelectedDays = () => {
        this.setState({ selectedDays: [] });
    }

    clearSelectedTime = () => {
        this.setState({ selectedTime: null });
    }

    areFieldsValid = () => {
        let validFlag = true;

        if (!this.areAllFieldsFilled()) {
            const element = <Alert message="Please fill out all information." banner />;
            ReactDOM.render(element, document.getElementById('invalidFieldsAlertT'));

            validFlag = false;
        }
        else {
            const element = '';
            ReactDOM.render(element, document.getElementById('invalidFieldsAlertT'));
        }

        return validFlag;
    }

    areAllFieldsFilled = () => {
        return this.state.alarmName.length > 0 && this.state.timeObj.timeString.length > 0 &&
            this.state.days.length > 0 && this.state.category.length > 0;
    }

    formatTime = (timeString, days) => {
        timeString = timeString.trim();
        let time = timeString.split(' ');
        let timeNumber = time[0] + ':00 ';
        let amOrPm = time[1] === 'am' ? 'AM' : 'PM';
        time = timeNumber + amOrPm;

        let daysRepeating = [];
        daysRepeating.push('Monday');
        daysRepeating.push('Tuesday');
        daysRepeating.push('Wednesday');
        daysRepeating.push('Thursday');
        daysRepeating.push('Friday');
        daysRepeating.push('Saturday');
        daysRepeating.push('Sunday');

        let selectedDays = [];
        daysRepeating.forEach(function (day) {
            if (days.includes(day.toLowerCase())) selectedDays.push(day);
        });

        return `${time} (${selectedDays.join(', ')})`;
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getDefaultCategoryValue = (category) => {
        this.handleCategoryInputChange(category.toLowerCase());
        return category;
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

        const columns =
            [
                {
                    title: 'Category',
                    dataIndex: 'category',
                    key: 'category',
                    width: 150,
                    filters: [
                        {
                            text: 'Prescription',
                            value: 'Prescription',
                        },
                        {
                            text: 'Hydration',
                            value: 'Hydration',
                        },
                        {
                            text: 'Workout',
                            value: 'Workout',
                        },
                    ],
                    onFilter: (value, record) => record.category.indexOf(value) === 0,

                    render: (_, record) => {
                        return this.isEditing(record.itemId) ?
                            (
                                <div>
                                    <Select defaultValue={() => this.getDefaultCategoryValue(record.category)} id="category" name="category" onChange={this.handleCategoryInputChange}>
                                        <Option value={"prescription"}>Prescription</Option>
                                        <Option value={"hydration"}>Hydration</Option>
                                        <Option value={"workout"}>Workout</Option>
                                    </Select>
                                </div>
                            )
                            :
                            (
                                record.category
                            );
                    }
                },
                {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',

                    render: (_, record) => {
                        return this.isEditing(record.itemId) && this.state.category === "hydration" ?
                            (
                                <div className="form-group">
                                    <input type="text" id="alarmNameT" name="alarmNameT" className="alarmName-input-table form-control" placeholder={record.description.split('(')[0]} maxLength="50" onChange={this.handleAlarmInputChange} />
                                    <input type="number" id="waterAmountT" name="waterAmountT" className="alarmName-input-table form-control" placeholder="Water (oz)" min="0" onChange={this.handleWaterInputChange} />
                                </div>
                            )
                            : this.isEditing(record.itemId) ?
                                (
                                    <div className="form-group">
                                        <input type="text" id="alarmNameT" name="alarmNameT" className="alarmName-input-table form-control" placeholder={record.description} maxLength="50" onChange={this.handleAlarmInputChange} />
                                    </div>
                                )
                                :
                                (
                                    record.description
                                );
                    }
                },
                {
                    title: 'Reminder Status',
                    dataIndex: 'alarm',
                    key: 'alarm',
                    width: 325,

                    render: (_, record) => {
                        return this.isEditing(record.itemId) ?
                            (
                                <div className="form-group">
                                    <TimePicker use12Hours value={this.state.selectedTime} id="time" name="time" className="time-input-table" format="h:mm a" placeholder="Select a new time" onChange={this.handleTimeInputChange} />
                                    <Select mode="multiple" value={this.state.selectedDays} id="days" name="days" className="days-input-table" placeholder="Select new days" onChange={this.handleDayInputChange}>
                                        {daysOfWeek}
                                    </Select>
                                </div>
                            )
                            :
                            (
                                record.alarm
                            );
                    }
                },
                {
                    title: "Action",
                    key: "action",
                    width: 180,
                    render: (_, record) => {
                        return this.isEditing(record.itemId) ?
                            (
                                <div>
                                    <a
                                        href="javascript:;"
                                        onClick={() => this.doEdit(record)}
                                        className="save-cancel-button"
                                    >
                                        Save
                                    </a>

                                    <a
                                        href="javascript:;"
                                        onClick={() => this.stopEditing()}
                                        className="save-cancel-button"
                                    >
                                        Cancel
                                    </a>

                                    <div id="invalidFieldsAlertT"></div>
                                </div>
                            )
                            :
                            (
                                <div>
                                    <Space size="small">
                                        <Button type="primary" shape="square" size="small" icon={<EditOutlined />} onClick={() => { this.startEditing(record.itemId); }}> Edit </Button>


                                        <Popconfirm title="Are you sure you want to delete?" onConfirm={() => { this.doDelete(record.itemId); }}>
                                            <Button type="ghost" shape="square" size="small" icon={<DeleteOutlined />}> Delete </Button>
                                        </Popconfirm >
                                    </Space>
                                </div>
                            );
                    }
                }
            ];

        return (
            <div class="search-container">
                <div class="search-child bar">
                    <br></br>
                    <h3>Health Dashboard</h3>
                    <input type="text" class="searchbar" name="search" placeholder="Search for alarms by their name" onChange={this.handleInputChange} />

                    <Tooltip title="Search">
                        <Button type="primary" shape="square" icon={<SearchOutlined />} className="search-button" onClick={() => this.doSearch()} />
                    </Tooltip>
                </div>

                <div>
                    <br></br>
                    <Table dataSource={this.state.dataSource} columns={columns} scroll={{ y: 300 }} pagination={false} />
                </div>
            </div>
        );
    }
}

export default Search;