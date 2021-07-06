import React from 'react';

import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import TrackerUI from '../components/TrackerUI';

const TrackerPage = () =>
{
    return(
        <div>
            <PageTitle />
            <LoggedInName />
            <TrackerUI />
        </div>
    );
}

export default TrackerPage;
