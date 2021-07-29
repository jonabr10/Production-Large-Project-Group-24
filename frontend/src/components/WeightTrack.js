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
                    <Divider>Set your weight goals</Divider>
                </div>

                <div class="float-left">
                    <div class="inner">
                        <div>Float Column 1</div>
                        <div>Float Column 1</div>
                        <div>Float Column 1</div>
                        <div>Float Column 1</div>
                        <div>Float Column 1</div>
                        <div>Float Column 1</div>
                    </div>
                </div>

                <div class="float-right">
                    <div class="inner">
                        <div>Float Column 1</div>
                        <div>Float Column 1</div>
                        <div>Float Column 1</div>
                        <div>Float Column 1</div>
                        <div>Float Column 1</div>
                        <div>Float Column 1</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WeightTrack;