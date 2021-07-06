import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import TrackerPage from './pages/TrackerPage';

function App()
{
    return (
        <Router >
            <Switch>
                <Route path="/" exact>
                    <LoginPage />
                </Route>
                <Route path="/trackers" exact>
                    <TrackerPage />
                </Route>
                <Redirect to="/" />
            </Switch>
        </Router>
    );
}

export default App;



// import React from 'react';
// import './App.css';
//
// import LoginPage from './pages/LoginPage';
// function App()
// {
//     return (
//         <LoginPage />
//     );
// }
//
// export default App;

// import React from 'react';
// import './App.css';
// import LoginPage from './pages/LoginPage';
// import TrackerPage from './pages/TrackerPage';
//
// function App()
// {
//     return (
//         <TrackerPage />
//     );
// }
//
// export default App;
