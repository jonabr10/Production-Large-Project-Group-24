import React from 'react'; 
import PageTitle from '../components/PageTitle'; 
import heart from '../components/img/heart.png';
import Account from '../components/Account';
import Logout from '../components/Logout';
import Alarms from '../components/Alarms';
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
                                <img src={heart} class="heart" alt="Heart"  />
                                <Account />
                            </div>

                            <Tabs defaultTab="vertical-tab-one" vertical className="vertical-tabs">
                                <TabList>
                                    <Tab tabFor="vertical-tab-one">Prescription</Tab>
                                    <Tab tabFor="vertical-tab-two">Workouts</Tab>
                                    <Tab tabFor="vertical-tab-three">Weight Tracking</Tab>
                                    <Tab tabFor="vertical-tab-four">Hydration</Tab>
                                </TabList>
                                <div class="column middle">
                                    <TabPanel tabId="vertical-tab-one" class="middle">
                                        <p>test 1asdfasdfjabsldfjkhasldkjfhaa;lskdjf;alksdjf;alksdjf;alksjdf;laksjdf;alksjdf;lkjsjdf;laksdjf;laksdjf;laksjdfl;akjsdhflajksdhfl;kajshdfl;kajshdf;aklhsdf</p>
                                    </TabPanel>
                                    <TabPanel tabId="vertical-tab-two" class="middle">
                                        <p>test 2</p>
                                    </TabPanel> 
                                    <TabPanel tabId="vertical-tab-three" class="middle">
                                        <p>test 3</p>
                                    </TabPanel> 
                                    <TabPanel tabId="vertical-tab-four" class="middle">
                                        <p>test 4</p>
                                    </TabPanel>
                                    </div> 
                                     
                            </Tabs>
                            <div class="leftpan"> 
                                <Logout /> 
                            </div>
                             
                        </div>
                        <div class="column right">
                            <Alarms />
                        </div>
                </div>
            </div>
        </div>
        
    );
}; 
export default MainPage;