import React, { Component } from 'react';
import './css/Menu.css';
import { Divider } from 'antd';

class WeightTrack extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div class="grid-container">   
                <div>
                    <br></br>
                    <h3>Weight Tracking</h3>
                </div>

                <div class="float-container">
                    <div class="float-child">
                        <div>Float Column 1</div>
                    </div>
                    
                    <div class="float-child">
                        <div>Float Column 2</div>
                    </div>
                </div>

            </div>
        );
    }
}

export default WeightTrack;