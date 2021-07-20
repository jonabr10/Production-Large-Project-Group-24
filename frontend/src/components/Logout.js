import React from 'react';
import { Link, BrowserRouter  } from 'react-router-dom';

var userID;
var userFirstName;
var userLastName;

class Logout extends React.Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <logout>
                    <button onclick={leaveBad}>
                        Logout
                    </button>
                    </logout>
                </BrowserRouter>
            </div>
        );
    }
}

function leaveBad()
{
    // Clear user fields held.
	userID = -1;
	userFirstName = "";
	userLastName = "";

    // Clear cookies by setting date to previous time.
	document.cookie = "firstName=,lastName=,id=;expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Relocate user to login page.
	window.location.href = "login.html";
}

export default Logout;