import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

class Logout extends Component {
    
    doLogin = () =>
    {

    }
    render() {
        return (
            <div>
                <Button type="primary" icon={<LogoutOutlined />} shape="round" onClick={() => this.doLogin()}>Logout</Button>
            </div>
        );
    }
}

export default Logout;