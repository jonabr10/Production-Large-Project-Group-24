import React, { Component } from 'react';
import './css/Menu.css';
import { Divider } from 'antd';

class Workouts extends Component
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
                    <h3>Workouts</h3>
                    <Divider>Create alarms for workouts</Divider>
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

export default Workouts;