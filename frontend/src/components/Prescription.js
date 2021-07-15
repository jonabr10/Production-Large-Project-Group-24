import React from 'react';
import './css/Menu.css';

function Prescription()
{
    return(
        <div class="grid-container">
            <div class="grid-child current">
                <h3>Prescriptions</h3>
            </div>

            <div class="grid-child new">
                <h3>New Prescriptions</h3>
                <form>
                    <inputs>Prescription Name</inputs>
                    <br></br>
                    <input type='text' name='prescription'/>
                    <br></br>
                    <br></br>
                    <input type='submit'/>
                </form>
            </div>
        </div>
        
    );
};

export default Prescription;