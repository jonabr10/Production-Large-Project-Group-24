import React, { Component } from 'react';
import './css/Search.css';
import { Button, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

class Search extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div class="search-container">
                <div class="search-child bar">
                    <h3>Search</h3>
                    <input type='text' class='searchbar' name='search'/>
                    
                    <Tooltip title="Search">
                        <Button type="primary" shape="square" icon={<SearchOutlined />} className="search-button"/>
                    </Tooltip> 
                </div>
                <div><h3>Results</h3></div>
                <div class="search-child result">
                    
                    <p>12:00 PM</p>
                    <p>2:00 PM</p>
                    <p>3:00 PM</p>
                    <p>4:00 PM</p>
                    <p>12:00 PM</p>
                    <p>2:00 PM</p>
                    <p>3:00 PM</p>
                    <p>4:00 PM</p>
                    <p>12:00 PM</p>
                    <p>2:00 PM</p>
                    <p>3:00 PM</p>
                    <p>4:00 PM</p>
                    <p>12:00 PM</p>
                    <p>2:00 PM</p>
                    <p>3:00 PM</p>
                    <p>4:00 PM</p>
                    <p>12:00 PM</p>
                    <p>2:00 PM</p>
                    <p>3:00 PM</p>
                    <p>4:00 PM</p>
                    <p>12:00 PM</p>
                    <p>2:00 PM</p>
                    <p>3:00 PM</p>
                    <p>4:00 PM</p>
                    <p>12:00 PM</p>
                    <p>2:00 PM</p>
                    <p>3:00 PM</p>
                    <p>4:00 PM</p>
                </div>
            </div>  
        );
    }
}

export default Search;