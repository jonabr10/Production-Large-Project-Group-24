import React, { Component } from 'react';
import './css/Search.css';
import { Button, Tooltip, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

class Search extends Component
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            search: '',
            dataSource: null
        }
    }

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
    }

    doSearch = () =>
    {
        let pathBuilder = require('../Path');
        
        let searchPayload = 
        {
            userId: this.props.userData.id,
            search: this.state.search
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
                    dataSource.push
                    ({
                        itemId: result._id,
                        category: category,
                        description: result.item,
                        alarm: alarmStatus
                    });
                });

                this.setState({ dataSource: dataSource });
            }
            else
            {
                this.setState({ dataSource: null });
            }
        });
    }

    checkResponse = (response) =>
    {
        if (response.status >= 500)
        {
            this.showErrorMessage('Error processing request', 'Did not get a valid response from server!');
            throw new Error('Invalid JSON from server - probably a server error');
        }

        return response;
    }

    render()
    {
        const columns = 
        [
            {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
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
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Alarm Status',
                dataIndex: 'alarm',
                key: 'alarm',
            },
            {
                title: "Action",
                key: "action",
                render: (row) => 
                {
                    return <span onClick={() => { alert(row.itemId);}}>Check ID</span >
                }
            }
        ];

        return (
            <div class="search-container">
                <div class="search-child bar">
                    <h3>Search</h3>
                    <input type="text" class="searchbar" name="search" onChange={this.handleInputChange}/>
                    
                    <Tooltip title="Search">
                        <Button type="primary" shape="square" icon={<SearchOutlined />} className="search-button" onClick={() => this.doSearch()} />
                    </Tooltip> 
                </div>
                <div><h4>Results</h4></div>
                
                <div>
                    <Table dataSource={this.state.dataSource} columns={columns} pagination={{ pageSize: 5, size: 'small'}}/>
                </div>
            </div>  
        );
    }
}

export default Search;