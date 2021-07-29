import React, { Component } from 'react';
import './css/Menu.css';
import { Divider } from 'antd';

class Prescription extends Component
{
    constructor(props)
    {
        super(props);
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
        return (
            <div class="grid-container">   
                <div>
                    <br></br>
                    <h3>Prescriptions</h3>
                    <Divider>Create alarms for prescriptions</Divider>
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

export default Prescription;