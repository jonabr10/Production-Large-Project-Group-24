import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import "antd/dist/antd.css";
import './antd-with-bootstrap.css'

import LoginSignupPage from "./pages/LoginSignupPage";
import MainPage from "./pages/MainPage";
import PassReset from "./components/PassReset";

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
        <Route path="/pass-reset" exact>
          <PassReset />
        </Route>
        <Redirect to="/" />
      </Switch>  
    </Router>
  );
}

export default App;