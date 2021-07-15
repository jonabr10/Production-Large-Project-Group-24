import React from 'react';
import './css/Menu.css';

function Alarms()
{
    return(
        <div className='grid-container'>
            <div className='grid-child current'>
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

            <div className="grid-child new">
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
                    <div className="checkbox-label">
                        <label>Sunday</label>
                        <div className="checkbox-container">
                        <input type='checkbox' name='sun'/>
                        </div>
                    </div>
                    <div className="checkbox-label">
                        <label>Monday</label>
                        <div className="checkbox-container">
                        <input type='checkbox' name='mon'/>
                        </div>
                    </div>
                    <div className="checkbox-label">
                        <label>Tuesday</label>
                        <div className="checkbox-container">
                        <input type='checkbox' name='tue'/>
                        </div>
                    </div>
                    <div className="checkbox-label">
                        <label>Wednesday</label>
                        <div className="checkbox-container">
                        <input type='checkbox' name='wed'/>
                        </div>
                    </div>
                    <div claclassNamess="checkbox-label">
                        <label>Thursday</label>
                        <div className="checkbox-container">
                        <input type='checkbox' name='thr'/>
                        </div>
                    </div>
                    <div className="checkbox-label">
                        <label>Friday</label>
                        <div className="checkbox-container">
                        <input type='checkbox' name='fri'/>
                        </div>
                    </div>
                    <div className="checkbox-label">
                        <label>Saturday</label>
                        <div className="checkbox-container">
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