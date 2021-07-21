import React, { Component } from 'react';
import './css/Search.css';
import { Button, Tooltip, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

class Search extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const columns = 
        [
            {
              title: 'Category',
              dataIndex: 'category',
              key: 'category',
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
        ];

        const dataSource = 
        [
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },
            {
                key: '1',
                category: 'Mike',
                description: 32,
                alarm: '10 Downing Street',
            },

        ];

        return (
            <div class="search-container">
                <div class="search-child bar">
                    <h3>Search</h3>
                    <input type='text' class='searchbar' name='search'/>
                    
                    <Tooltip title="Search">
                        <Button type="primary" shape="square" icon={<SearchOutlined />} className="search-button"/>
                    </Tooltip> 
                </div>
                <div><h4>Results</h4></div>
                
                <div>
                    <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5, size: 'small'}}/>
                </div>
            </div>  
        );
    }
}

export default Search;