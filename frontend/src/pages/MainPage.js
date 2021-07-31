import React, { Component } from 'react';
import PageTitle from '../components/PageTitle'; 
import Account from '../components/Account';
import Logout from '../components/Logout';
import Prescription from '../components/Prescription';
import Hydration from '../components/Hydration';
import WeightTrack from '../components/WeightTrack';
import Search from '../components/Search';
import Workouts from '../components/Workouts';
import './css/MainPage.css';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import "./css/react-web-tabs.css";

class MainPage extends Component
{
    constructor(props)
    {
        super(props);

        this.getUserData();
    }
    
    getRecords = () =>
    {
        let pathBuilder = require('../Path');
        let tokenStorage = require('../tokenStorage');
        let userData = this.getUserData();

        let searchPayload = 
        {
            userId: userData.id,
            search: "",
            jwtToken: tokenStorage.retrieveToken()
        }

        let httpRequest = 
        {
            method: 'post',
            body: JSON.stringify(searchPayload),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }
        
        fetch(pathBuilder.buildPath('api/search'), httpRequest)
        .then(this.checkResponse)
        .catch(function(error) { console.log(error); })
        .then(response => response.json())
        .then(responseData =>
        {
            if (responseData.error.length === 0)
            {
                tokenStorage.storeToken(responseData.jwtToken);
                return responseData.results;        
            }
            else
            {
                return 0;
            }
        });
    }

    checkResponse = (response) =>
    {
        if (response.status >= 500)
        {
            this.showNotification('error', 'Server Error: Did not get a valid response from server!');
            throw new Error('Invalid JSON from server - probably a server error');
        }

        return response;
    }

    getUserData = () =>
    {
        let userData = localStorage.getItem('user_data');
        
        if (userData == null || userData.length === 0)
        {
            window.location.href = '/sign-in';
        }
        
        userData = JSON.parse(userData);

        return userData;
    }
    
    render()
    {
        let userData = this.getUserData();
        
        let records = this.getRecords();
        //result.rx, result.hy, result.workout filter
        
        return (
            <div>
                <div class="lower">
                    <div class="upper"> 
                        <PageTitle /> 
                    </div>
                        <div class="row">
                            <div class="column left">
                                <div class="leftpan">  
                                    <Account userData={userData}/>
                                </div>
                                <Tabs defaultTab="vertical-tab-zero" vertical class="vertical-tabs">
                                    <TabList>
                                        <Tab tabFor="vertical-tab-zero">Health Dashboard</Tab>
                                        <Tab tabFor="vertical-tab-one">Prescription</Tab>
                                        <Tab tabFor="vertical-tab-two">Workout</Tab>
                                        <Tab tabFor="vertical-tab-four">Hydration</Tab>
                                        <Tab tabFor="vertical-tab-three">Weight Tracking</Tab>
                                        <br></br>
                                        <Logout /> 
                                    </TabList>
                                    
                                    <div class="column middle">
                                        <TabPanel tabId="vertical-tab-zero" class="middle">
                                            <Search userData={userData}/>
                                        </TabPanel>
                                        <TabPanel tabId="vertical-tab-one" class="middle">
                                            <Prescription userData={userData}/>
                                        </TabPanel>
                                        <TabPanel tabId="vertical-tab-two" class="middle">
                                            <Workouts userData={userData}/>
                                        </TabPanel> 
                                        <TabPanel tabId="vertical-tab-three" class="middle">
                                            <WeightTrack userData={userData}/>
                                        </TabPanel> 
                                        <TabPanel tabId="vertical-tab-four" class="middle">
                                            <Hydration userData={userData}/>
                                        </TabPanel>
                                    </div> 
                                </Tabs>
                            </div>
                    </div>
                </div>
            </div>
            
        );
    }
}
export default MainPage;