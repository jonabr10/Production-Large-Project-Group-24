import React, { Component } from 'react';
import './css/Search.css';
import { Button, Tooltip, Table, Space, Popconfirm, notification } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

class Search extends Component
{
    constructor(props)
    {
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

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
    }

    handleAlarmInputChange = ({ target }) => 
    {
        this.setState({ alarmName: target.value });
    }

    handleWaterInputChange = ({ target }) => 
    {
        this.setState({ waterAmount: target.value });
    }

    handleTimeInputChange = (time, timeString) => 
    {
        this.setState({ timeObj: { time: time, timeString: timeString } });
        this.setState({ selectedTime: time });
    }

    handleDayInputChange = (days) => 
    {
        this.setState({ days: days });
        this.setState({ selectedDays: days });
    }

    doSearch = () =>
    {
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
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }
        
        fetch(pathBuilder.buildPath('api/search'), httpRequest)
        .then(this.checkResponse)
        .catch(function(error) { console.log(error); })
        .then(response => response.json())
        .then(responseData =>
        {
            if (responseData.error.length === 0)
            {
                tokenStorage.storeToken(responseData.jwtToken);
                let results = responseData.results;
                let dataSource = [];
                
                results.forEach(function(result)
                {
                    let category = result.rx ? 'Prescription' : result.hy ? 'Hydration' : 'Workout';
                    
                    let daysRepeating = [];
                    if (result.alarms[0] != null)
                    {
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
                    if (rawTime !== 'No alarm set!')
                    {
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
            else
            {
                this.showNotification('warning', responseData.error);
                this.setState({ dataSource: null });
            }
        });
    }

    doEdit = (itemId) =>
    {
        alert(itemId);
    }

    doDelete = (itemId) =>
    {
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
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }
        
        fetch(pathBuilder.buildPath('api/deleteItem'), httpRequest)
        .then(this.checkResponse)
        .catch(function(error) { console.log(error); })
        .then(response => response.json())
        .then(responseData =>
        {
            if (responseData.error.length === 0)
            {
                tokenStorage.storeToken(responseData.jwtToken);
                const dataSource = [...this.state.dataSource];
                this.setState
                ({
                    dataSource: dataSource.filter((item) => item.itemId !== itemId),
                });

                this.showNotification('success', 'Successfully deleted alarm!');
            }
            else
            {
                this.showNotification('error', responseData.error);
            }
        });
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

    isEditing = (itemId) => 
    {
        return this.state.editingRecord.isEditing && this.state.editingRecord.itemId == itemId;
    }

    setEditing = (isEditing, itemId) => 
    {
        this.setState({ editingRecord: {isEditing: isEditing, itemId: itemId} });
    }

    startEditing = (itemId) => 
    {
        this.setEditing(true, itemId);
    }

    stopEditing = () => 
    {
        this.setEditing(false, '');
    }

    render()
    {
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

                render: (_, record) => 
                {
                    return this.isEditing(record.itemId) ? 
                    (
                        <div>
                            we editing!!
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

                render: (_, record) => 
                {
                    return this.isEditing(record.itemId) ? 
                    (
                        <div>
                            we editing!!
                        </div>
                    )
                    :
                    (
                        record.description
                    );
                }
            },
            {
                title: 'Alarm Status',
                dataIndex: 'alarm',
                key: 'alarm',
                width: 325,
                
                render: (_, record) => 
                {
                    return this.isEditing(record.itemId) ? 
                    (
                        <div>
                            we editing!!
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
                render: (_, record) => 
                {
                    return this.isEditing(record.itemId) ? 
                    (
                        <a 
                            href="javascript:;"
                            onClick={ () => this.stopEditing() }
                            className="mr-3"
                        >
                            Stop Editing
                        </a>
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
                    <input type="text" class="searchbar" name="search" placeholder="Search for alarms by their name" onChange={this.handleInputChange}/>
                    
                    <Tooltip title="Search">
                        <Button type="primary" shape="square" icon={<SearchOutlined />} className="search-button" onClick={() => this.doSearch()} />
                    </Tooltip> 
                </div>
                
                <div>
                    <br></br>
                    <Table dataSource={this.state.dataSource} columns={columns} scroll={{ y: 300 }} pagination={ false }/>
                </div>
            </div>  
        );
    }
}

export default Search;