import React from 'react';
import './css/Search.css';

function Search()
{
    return(
        <div class="grid-container">
            <div class="grid-child bar">
                <h3>Search</h3>
            </div>

            <div class="grid-child result">
                <h3>Results</h3>
                <form>
                    <inputs>Water Drank in Ounces</inputs>
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

export default Search;