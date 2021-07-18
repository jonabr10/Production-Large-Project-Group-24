import React, { Component } from "react";
import './css/LoginAndSignup.css'

export default class SignUp extends Component {
    constructor(props)
    {
        super(props);
        this.state = 
        {
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        }
    }

    myFunc = () =>
    {
        alert('user: ' + this.state.username + '\npass: ' + this.state.password + '\nfName: ' + this.state.firstName + '\nlName: ' + this.state.lastName + '\nemail: ' + this.state.email);
    }

    handleInputChange = ({ target }) => 
    {
        this.setState({ [target.name]: target.value });
    }
    
    render() {
        return (
            <form>
                <h3>Register</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" name="firstName" className="form-control" placeholder="First name" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" name="lastName" className="form-control" placeholder="Last name" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="text" name="email" className="form-control" placeholder="Enter email" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" placeholder="Enter username" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Enter password" onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm password" onChange={this.handleInputChange} />
                </div>

                <br></br>
                <button type="submit" className="btn btn-dark btn-lg btn-block" onClick={() => this.myFunc()}>Register</button>
                <p className="forgot-password text-right">
                    Already registered <a href="#">log in?</a>
                </p>
            </form>
        );
    }
}