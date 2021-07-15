import React from 'react'; 
import PageTitle from '../components/PageTitle'; 
import Account from '../components/Account';
import Logout from '../components/Logout';
import Alarms from '../components/Alarms';
import Prescription from '../components/Prescription';
import Hydration from '../components/Hydration';
import WeightTrack from '../components/WeightTrack';
import Search from '../components/Search';
import Workouts from '../components/Workouts';
import './css/MainPage.css';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import "./css/react-web-tabs.css";

const MainPage = () => {
    return (
        <div>
            <div class="lower">
                <div class="upper"> 
                    <PageTitle /> 
                </div>
                    <div class="row">
                        <div class="column left">
                            <div class="leftpan"> 
                                
                                <Account />
                            </div>
                            <Tabs defaultTab="vertical-tab-one" vertical class="vertical-tabs">
                                <TabList>
                                    <Tab tabFor="vertical-tab-zero">Search</Tab>
                                    <Tab tabFor="vertical-tab-one">Prescription</Tab>
                                    <Tab tabFor="vertical-tab-two">Workouts</Tab>
                                    <Tab tabFor="vertical-tab-three">Weight Tracking</Tab>
                                    <Tab tabFor="vertical-tab-four">Hydration</Tab>
                                    <Tab tabFor="vertical-tab-five">Alarms</Tab>
                                    <Tab tabFor="vertical-tab-six"><Logout/> </Tab>
                                </TabList>
                                
                                <div class="column middle">
                                    <TabPanel tabId="vertical-tab-zero" class="middle">
                                        <Search />
                                    </TabPanel>
                                    <TabPanel tabId="vertical-tab-one" class="middle">
                                        <Prescription />
                                    </TabPanel>
                                    <TabPanel tabId="vertical-tab-two" class="middle">
                                        <Workouts />
                                    </TabPanel> 
                                    <TabPanel tabId="vertical-tab-three" class="middle">
                                        <WeightTrack />
                                    </TabPanel> 
                                    <TabPanel tabId="vertical-tab-four" class="middle">
                                        <Hydration />
                                    </TabPanel>
                                    <TabPanel tabId="vertical-tab-five" class="middle">
                                        <Alarms />
                                    </TabPanel>
                                </div> 
                            </Tabs>
                        </div>
                </div>
            </div>
        </div>
        
    );
}; 
export default MainPage;