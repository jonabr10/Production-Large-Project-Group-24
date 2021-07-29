import React, { Component } from 'react';
import './css/Menu.css';
import { Divider } from 'antd';

class Hydration extends Component
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
                    <h3>Hydration</h3>
                    <Divider>Create alarms for water intake</Divider>
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

export default Hydration;