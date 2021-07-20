import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import "antd/dist/antd.css";
import './antd-with-bootstrap.css'

import LoginSignupPage from "./pages/LoginSignupPage";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <Router >
      <Switch>
        <Route path="/" exact>
          <LoginSignupPage />
        </Route>
        <Route path="/main-page" exact>
          <MainPage />
        </Route>
        <Redirect to="/" />
      </Switch>  
    </Router>
  );
}

export default App;