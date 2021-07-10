import React from 'react';
import { Link, BrowserRouter  } from 'react-router-dom';
import './css/Menu.css'

class Logout extends React.Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <logout>
                        <Link to="/logout">Logout</Link>
                    </logout>
                </BrowserRouter>
            </div>
        );
    }
}

export default Logout;