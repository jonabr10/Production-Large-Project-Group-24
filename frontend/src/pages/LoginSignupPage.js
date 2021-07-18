import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "../components/Login";
import SignUp from "../components/SignUp";


const LoginSignupPage = () => {
    return (
        <Router>
            <div className="App">
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                <div className="container">
                <Link className="navbar-brand" to={"/sign-in"}>Health and Wellness</Link>
                <div className="collapse navbar-collapse" id="navbarToggler">
                    <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to={"/sign-in"}>Sign in</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                    </li>
                    </ul>
                </div>
                </div>
            </nav>

            <div className="outer">
                <div className="inner">
                <Switch>
                    <Route exact path='/' component={Login} />
                    <Route path="/sign-in" component={Login} />
                    <Route path="/sign-up" component={SignUp} />
                </Switch>
                </div>
            </div>
            </div>
        </Router>
    );
}
export default LoginSignupPage;