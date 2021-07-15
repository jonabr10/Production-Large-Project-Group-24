import React from 'react';
import './css/Menu.css';

function Alarms()
{
    return(
        <div class='grid-container'>
            <div class='grid-child current'>
                <h3>Alarms</h3>
                <p>12:00 PM</p>
                <p>2:00 PM</p>
                <p>3:00 PM</p>
                <p>4:00 PM</p>
                <p>12:00 PM</p>
                <p>2:00 PM</p>
                <p>3:00 PM</p>
                <p>4:00 PM</p>
                <p>12:00 PM</p>
                <p>2:00 PM</p>
                <p>3:00 PM</p>
                <p>4:00 PM</p>
                <p>12:00 PM</p>
                <p>2:00 PM</p>
                <p>3:00 PM</p>
                <p>4:00 PM</p>
                <p>12:00 PM</p>
                <p>2:00 PM</p>
                <p>3:00 PM</p>
                <p>4:00 PM</p>
                <p>12:00 PM</p>
                <p>2:00 PM</p>
                <p>3:00 PM</p>
                <p>4:00 PM</p>
                <p>12:00 PM</p>
                <p>2:00 PM</p>
                <p>3:00 PM</p>
                <p>4:00 PM</p>
            </div>

            <div class="grid-child new">
                <h3>New Alarm</h3>
                <form>
                    <inputs>Name </inputs>
                    <br></br>
                    <input type='text' name='name'/>
                    <br></br>
                    <br></br>
                    <inputs>Time </inputs>
                    <br></br>
                    <input type='time' name='time'/>
                    <br></br>
                    <br></br>
                    <inputs>Dates </inputs>
                    <br></br>
                    <div class="checkbox-label">
                        <label>Sunday</label>
                        <div class="checkbox-container">
                        <input type='checkbox' name='sun'/>
                        </div>
                    </div>
                    <div class="checkbox-label">
                        <label>Monday</label>
                        <div class="checkbox-container">
                        <input type='checkbox' name='mon'/>
                        </div>
                    </div>
                    <div class="checkbox-label">
                        <label>Tuesday</label>
                        <div class="checkbox-container">
                        <input type='checkbox' name='tue'/>
                        </div>
                    </div>
                    <div class="checkbox-label">
                        <label>Wednesday</label>
                        <div class="checkbox-container">
                        <input type='checkbox' name='wed'/>
                        </div>
                    </div>
                    <div class="checkbox-label">
                        <label>Thursday</label>
                        <div class="checkbox-container">
                        <input type='checkbox' name='thr'/>
                        </div>
                    </div>
                    <div class="checkbox-label">
                        <label>Friday</label>
                        <div class="checkbox-container">
                        <input type='checkbox' name='fri'/>
                        </div>
                    </div>
                    <div class="checkbox-label">
                        <label>Saturday</label>
                        <div class="checkbox-container">
                        <input type='checkbox' name='sat'/>
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <input type='submit'/>
                </form>
            </div>
        </div>
        
    );
};

export default Alarms;