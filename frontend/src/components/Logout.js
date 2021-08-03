import React, { Component } from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

class Logout extends Component {
    
    doLogout = () =>
    {
        localStorage.clear();
        window.location.href = '/sign-in';
    }

    render() {
        return (
            <div>
                <Button type="primary" icon={<LogoutOutlined />} shape="round" onClick={() => this.doLogout()}>Logout</Button>
            </div>
        );
    }
}

export default Logout;