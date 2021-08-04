import React, { Component } from 'react';
import './css/Menu.css';

class Account extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div>
                <div class="welcome-text">Welcome, {this.props.userData.firstName} {this.props.userData.lastName}</div>
            </div>
        );
    }
}

export default Account;