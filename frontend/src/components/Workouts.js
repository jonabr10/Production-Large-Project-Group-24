import React from 'react';
import './css/Menu.css';

function Workouts()
{
    return(
        <div class="grid-container">
            <div class="grid-child current">
                <h3>Workout list</h3>
            </div>

            <div class="grid-child new">
                <h3>Add new Workout</h3>
                <form>
                    <inputs>Workout Name </inputs>
                    <br></br>
                    <input type='text' name='weight'/>
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

export default Workouts;