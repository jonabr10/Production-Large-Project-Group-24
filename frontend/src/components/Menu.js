import React from 'react';
import './css/Menu.css';

function Menu()
{
    return(
        <div>
            <ul>
                <li><a class="active" href="#presecription">Prescription</a></li>
                <li><a class="#Workouts" href="#workouts">Workouts</a></li>
                <li><a class="#Weighttracking" href="#weighttracking">Weight Tracking</a></li>
                <li><a class="#Hydration" href="#hydration">Hydration</a></li>
            </ul>

        </div>
        
    );
};

export default Menu;