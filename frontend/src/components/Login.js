import React, { Component } from "react";
import './css/LoginAndSignup.css'

export default class Login extends Component {
    constructor(props)
    {
        super(props);
        this.state = 
        {
            username: '',
            password: ''
        }
    }

    myFunc = () =>
    {
        alert(this.state.username + ' ' + this.state.password);
    }

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
    }

    render() {
        return (    
            <form>
                <h3>Log in</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" placeholder="Enter username" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Enter password" onChange={this.handleInputChange} />
                </div>
                
                <br></br>
                <button type="submit" className="btn btn-dark btn-lg btn-block" onClick={() => this.myFunc()}>Sign in</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        );
    }
}