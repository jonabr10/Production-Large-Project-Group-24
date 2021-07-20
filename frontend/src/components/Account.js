import React, { Component } from 'react';
import './css/Menu.css';

class Account extends Component
{
    constructor(props)
    {
        super(props);
    }

    render(){
        return(
            <div>
                <h3>{this.props.userData.firstName} {this.props.userData.lastName}</h3>
            </div>
        );
    }
}

export default Account;