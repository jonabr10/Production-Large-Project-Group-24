import React from 'react';
import './css/Menu.css';

function WeightTrack()
{
    return(
        <div class="grid-container">
            <div class="grid-child current">
                <h3>Weight Log</h3>
            </div>

            <div class="grid-child new">
                <h3>Add new log</h3>
                <form>
                    <inputs>Weight</inputs>
                    <br></br>
                    <input type='number' name='weight'/>
                    <br></br>
                    <br></br>
                    <inputs>Date</inputs>
                    <br></br>
                    <input type='date' name='date'/>
                    <br></br>
                    <br></br>
                    <input type='submit'/>
                </form>
            </div>
        </div>
        
    );
};

export default WeightTrack;