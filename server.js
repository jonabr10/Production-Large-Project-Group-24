const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

// Creating JWT:
var token = require('./createJWT.js');

// 3 categories:
// - Workout
// - prescription
// - hydration

// Incoming: user object
// Outgoing: users[]
async function getUser(userName, email) {
    const db = client.db();
    var _userName = (userName.toString()).trim();
    var _email = (email.toString()).trim();

    const userResult = await db.collection('users').findOne(
        {
            $or: [
                { "userName": _userName },
                { "email": _email }
            ]
        }
    )

    return userResult;
}

// Incoming: item objects
// Outgoing: alarms[]
async function getItem(userId, itemName) {

    const db = client.db();
    var _item = (itemName.toString()).trim();

    const itemResult = await db.collection('items').findOne(
        {
            $and: [
                { "userId": userId },
                { "item": _item }
            ]
        }
    )

    return itemResult;
}

// Incoming: _id from items collections
// Outgoing: alarms[]
async function getAlarms(itemResult) {

    const db = client.db();
    var _itemId = (itemResult._id.toString()).trim();

    const alarmResults = await db.collection('alarms').find(
        { "itemId": _itemId }
    ).toArray();

    var _retAlarms = [];

    // Debug: verify alarm object content
    // debugAlarmObject(alarmResults[0]);

    for (var i = 0; i < alarmResults.length; i++) {
        _retAlarms.push({
            _id: alarmResults[i]._id,
            userId: alarmResults[i].userId,
            itemId: alarmResults[i].itemId,
            time: alarmResults[i].time,
            monday: alarmResults[i].monday,
            tuesday: alarmResults[i].tuesday,
            wednesday: alarmResults[i].wednesday,
            thursday: alarmResults[i].thursday,
            friday: alarmResults[i].friday,
            saturday: alarmResults[i].saturday,
            sunday: alarmResults[i].sunday
        });
    }

    return _retAlarms;
}

// Incoming: alarm object
// Outgoing: none
function debugAlarmObject(alarmObj) {
    console.log('alarm[] ' + typeof alarmObj._id + ' _id/ObjectId value: ' + alarmObj._id);
    console.log('alarm[] ' + typeof alarmObj.userId + ' userId value: ' + alarmObj.userId);
    console.log('alarm[] ' + typeof alarmObj.itemId + ' itemId value: ' + alarmObj.itemId);
    console.log('alarm[] ' + typeof alarmObj.time + ' time value: ' + alarmObj.time);
    console.log('alarm[] ' + typeof alarmObj.monday + ' monday value: ' + alarmObj.monday);
    console.log('alarm[] ' + typeof alarmObj.tuesday + ' tuesday value: ' + alarmObj.tuesday);
    console.log('alarm[] ' + typeof alarmObj.wednesday + ' wednesday value: ' + alarmObj.wednesday);
    console.log('alarm[] ' + typeof alarmObj.thursday + ' thursday value: ' + alarmObj.thursday);
    console.log('alarm[] ' + typeof alarmObj.friday + ' friday value: ' + alarmObj.friday);
    console.log('alarm[] ' + typeof alarmObj.saturday + ' saturday value: ' + alarmObj.saturday);
    console.log('alarm[] ' + typeof alarmObj.sunday + ' sunday value: ' + alarmObj.sunday);
}

async function deleteItem(itemToBeDeleted) {
    var error = '';

    try {
        const db = client.db();
        db.collection('items').deleteOne(
            { "_id": itemToBeDeleted._id }
        )

    } catch (e) {
        error = e.toString();
    }

    return error;
}

async function deleteAlarms(itemToBeDeleted) {
    var error = '';
    var _itemId = (itemToBeDeleted._id.toString()).trim();

    try {
        const db = client.db();

        // Important: we are utilizing _id (item object id) as the arguement to pass for
        //            deleteMany collection method
        db.collection('alarms').deleteMany(
            { "itemId": _itemId }
        )

    } catch (e) {
        error = e.toString();
    }

    return error;
}

app.post('/api/deleteItem', async (req, res, next) => {
    var error = '';
    var deleteCount = 0;

    const { userId, item, jwtToken  } = req.body;

    // check if the item exists in the database
    var itemToBeDeleted = await getItem(userId, item);

    if (itemToBeDeleted) {

        // check if itemToBeDeleted have any alarms
        var doesItemToBeDeletedHaveAlarms = await getAlarms(itemToBeDeleted);

        if (doesItemToBeDeletedHaveAlarms.length > 0) {

            // update deleteCount with the current number of alarms within itemToBeDeleted
            deleteCount += doesItemToBeDeletedHaveAlarms.length;
            error = await deleteAlarms(itemToBeDeleted);

            // after deleting all the alarms within itemToBeDeleted, delete itemToBeDeleted
            error = (error + await deleteItem(itemToBeDeleted));
            deleteCount++;
        }

        else if (doesItemToBeDeletedHaveAlarms.length <= 0) {
            error = await deleteItem(itemToBeDeleted);
            deleteCount++;
        }
    }

    else if (!itemToBeDeleted) {
        error = 'Item does not exist';
    }

    var refreshedToken = null;      
    try      
    {
        refreshedToken = token.refresh(jwtToken);      
    }      
    catch(e)      
    {        
        console.log(e.message);      
    }      
    // var ret = { error: error, jwtToken: refreshedToken };

    var ret = { userId: userId, item: item, deleteCount: deleteCount, error: error, jwtToken: refreshedToken };
    res.status(200).json(ret);
});

// Incoming: userId, _id (alarm object), itemId
// Outgoing: userId, _id, itemId, deleteCount, error
// Purpose: deletes an alarm and validates the existence of the alarm
app.post('/api/deleteAlarm', async (req, res, next) => {
    var error = '';
    var deleteCount = 0;

    const { userId, alarmId } = req.body;

    // check if the alarm exists in the database
    var alarmToBeDeleted = await getAlarm(alarmId);

    if (alarmToBeDeleted) {
        error = await deleteAlarm(alarmToBeDeleted);
        deleteCount++;
    }

    else if (!alarmToBeDeleted) {
        error = 'Alarm does not exist';
    }
    
    // var refreshedToken = null;      
    // try      
    // {
    //     refreshedToken = token.refresh(jwtToken);      
    // }      
    // catch(e)      
    // {        
    //     console.log(e.message);      
    // }      
    var ret = { userId: userId, alarm: alarmId, deleteCount: deleteCount, error: error, /*jwtToken: refreshedToken*/ };
    res.status(200).json(ret);
});

// Incoming: new user credentials
// Outgoing: none
app.post('/api/register', async (req, res, next) => {

    const { firstName, lastName, userName, password, email } = req.body;

    // Check to see if the new user already exists in the database
    var isTheNewUserDuplicate = await getUser(userName, password);

    if (!isTheNewUserDuplicate) {

        const registerNewUser = { firstName: firstName, lastName: lastName, userName: userName, password: password, email: email }
        var error = '';

        try {

            const db = client.db();
            db.collection('users').insertOne(registerNewUser);
        } catch (e) {

            error = e.toString();
        }

        try        
        {          
            const token = require("./createJWT.js");          
            ret = token.createToken( fn, ln, id, email );        
        }        
        catch(e)        
        {          
            ret = {error:e.message};        
        }      

        var ret = { firstName: firstName, lastName: lastName, userName: userName, email: email, error: '' };
    }

    else if (isTheNewUserDuplicate) {

        var ret = { firstName: firstName, lastName: lastName, userName: userName, email: email, error: 'User already exists please login instead' };
    }

    res.status(200).json(ret);
});

// Incoming: login, password
// Outgoing: id, firstName, lastName, email, error
app.post('/api/login', async (req, res, next) => {

    var error = '';

    const { login, password } = req.body;
    const db = client.db();
    const results = await
        db.collection('users').find({ userName: login, password: password }).toArray();

    var id = -1;
    var fn = '';
    var ln = '';
    var email = '';

    if (results.length > 0) {
        id = results[0].userId;
        fn = results[0].firstName;
        ln = results[0].lastName;
        email = results[0].email

        // var ret = { id: id, firstName: fn, lastName: ln, email: email, error: '' };
        try        
        {          
            const token = require("./createJWT.js");          
            ret = token.createToken( fn, ln, id, email );        
        }        
        catch(e)        
        {          
            ret = {error:e.message};        
        }      
    }      
    else      
    {          
        // ret = {error:"Login/Password incorrect"};    
        var ret = { id: id, firstName: fn, lastName: ln, email: email, error: 'Invalid Username/Password' };  
    }
    
    // else if (results.length <= 0) {
    //     var ret = { id: id, firstName: fn, lastName: ln, email: email, error: 'Invalid Username/Password' };
    // }

    
    res.status(200).json(ret);
});

// Incoming: userId
// Outgoing: all user Alarms[] w/ userId
app.post('/api/getAllUserAlarms', async (req, res, next) => {

    const { userId, jwtToken } = req.body;

    const db = client.db();
    const alarmResults = await db.collection('alarms').find(
        { "userId": userId }
    ).toArray();

    if (alarmResults.length > 0) {

        var _retAlarms = [];

        for (var i = 0; i < alarmResults.length; i++) {
            _retAlarms.push({
                _id: alarmResults[i]._id,
                userId: alarmResults[i].userId,
                itemId: alarmResults[i].itemId,
                date: alarmResults[i].date,
                time: alarmResults[i].time,
                monday: alarmResults[i].monday,
                tuesday: alarmResults[i].tuesday,
                wednesday: alarmResults[i].wednesday,
                thursday: alarmResults[i].thursday,
                friday: alarmResults[i].friday,
                saturday: alarmResults[i].saturday,
                sunday: alarmResults[i].sunday
            });
        }

        var refreshedToken = null;      
        try      
        {        
            refreshedToken = token.refresh(jwtToken);      
        }      
        catch(e)      
        {        
            console.log(e.message);      
        }      
        // var ret = { results:_ret, error: error, jwtToken: refreshedToken };
        var ret = { Alarms: _retAlarms, error: " ", jwtToken: refreshedToken };
        res.status(200).json(ret);
    }

    else {
        var ret = { results: _ret, error: "No records found" };
        res.status(200).json(ret);
    }
});

// Incoming: userId, search
// Outgoing: results[], error
// Purpose:  searches the database based on the userId and item (item name)
app.post('/api/search', async (req, res, next) => {

    var error = '';
    const { userId, search, jwtToken } = req.body;

    var _search = search.trim();
    const db = client.db();
    const itemResults = await db.collection('items').find(
        {
            $and: [
                { "userId": userId },
                { "item": { $regex: _search + '.*', $options: 'r' } }
            ]
        }
    ).toArray();

    var _ret = [];

    if (itemResults.length > 0) {

        for (var i = 0; i < itemResults.length; i++) {

            var _alarms = await getAlarms(itemResults[i]);

            _ret.push({
                _id: itemResults[i]._id,
                item: itemResults[i].item,
                userId: itemResults[i].userId,
                rx: itemResults[i].rx,
                workout: itemResults[i].workout,
                hy: itemResults[i].hy,
                waterAmount: itemResults[i].waterAmount,
                alarms: _alarms
            });
        }

        var refreshedToken = null;      
        try      
        {        
            refreshedToken = token.refresh(jwtToken);      
        }      
        catch(e)      
        {        
            console.log(e.message);      
        }      
        var ret = { results:_ret, error: error, jwtToken: refreshedToken };
        // var ret = { results: _ret, error: error };
        res.status(200).json(ret);
    }

    else {
        var _test = await getItem(userId, _search);
        console.log('Testing length of empty array: ' + _test.length);

        var ret = { results: _ret, error: "No records found" };
        res.status(200).json(ret);
    }

});

// Incoming: userId, weight, date, desiredWeight
// Outgoing: userId, weight, date, desiredWeight, error
// Purpose: adds a new weight and desiredWeight input to the database
app.post('/api/addWeight', async (req, res, next) => {

    const { userId, weight, date, desiredWeight, jwtToken } = req.body;
    var error = '';

    const newWeight = {
        userId: userId,
        weight: weight,
        date: date,
        desiredWeight: desiredWeight
    }

    try {
        const db = client.db();
        db.collection('weights').insertOne(newWeight);

    } catch (e) {
        error = e.toString();
    }

    var ret = {
        userId: userId,
        weight: weight,
        date: date,
        desiredWeight: desiredWeight,
        error: error
    };

    var refreshedToken = null;      
    try      
    {
        refreshedToken = token.refresh(jwtToken);      
    }      
    catch(e)      
    {        
        console.log(e.message);      
    }      
    var ret = { error: error, jwtToken: refreshedToken };
    res.status(200).json(ret);
});


async function calculateWeightDifferenceFromGoal(arrayOfWeight) {
    return Math.abs(arrayOfWeight[0].desiredWeight - arrayOfWeight[0].weight);
}

// Purpose: this calculates the the percentage of the 2 most recent weight inputs, if
//          there is only one weight it returns 0
async function calculatePercentageOfWeightChange(arrayOfWeight) {
    // if there is only one weight input
    if (arrayOfWeight.length <= 1) {
        return 0;
    }

    else {
        var differenceFromPreviousWeight = Math.abs(arrayOfWeight[0].weight - arrayOfWeight[1].weight);

        return Math.round((differenceFromPreviousWeight / arrayOfWeight[1].weight) * 100);
    }
}

// Incomming: userId
// Outgoing: userId, desiredWeight (most recent add), currentWeightDifferenceFromGoal (abs value),
//           percentageFromWeightGoal, arrayOfWeight[]
app.post('/api/outputWeight', async (req, res, next) => {

    const { userId, jwtToken } = req.body;
    var error = '';

    const db = client.db();
    var sizeOfWeightCollection = await db.collection('weights').countDocuments(
        { "userId": userId }
    );

    // in the event that the user has not inputted any weights, then we need to add first
    if (sizeOfWeightCollection <= 0) {
        var ret = {
            userId: userId,
            desiredWeight: 0,
            currentWeightDifferenceFromGoal: 0,
            percentageFromWeightGoal: 0,
            arrayOfWeight: [],
            error: "No records found"
        }
    }

    else if (sizeOfWeightCollection > 0) {
        var arrayOfWeight = await db.collection('weights').find(
            { "userId": userId }
        ).sort(
            { _id: -1 }
        ).toArray();

        // gets an integer value of the difference between desired weight and current weight
        var weightDiffFromGoal = await calculateWeightDifferenceFromGoal(arrayOfWeight);
        var percentageOfWeightChange = await calculatePercentageOfWeightChange(arrayOfWeight);

        var refreshedToken = null;      
        try      
        {        
            refreshedToken = token.refresh(jwtToken);      
        }      
        catch(e)      
        {        
            console.log(e.message);      
        }      
        // var ret = { results:_ret, error: error, jwtToken: refreshedToken };
        var ret = {
            userId: userId,
            currentdesiredWeight: arrayOfWeight[0].desiredWeight,
            currentWeightDifferenceFromGoal: weightDiffFromGoal,
            percentageOfWeightChange: percentageOfWeightChange,
            arrayOfWeight: arrayOfWeight,
            error: "", jwtToken: refreshedToken
        }
    }

    res.status(200).json(ret);
});

app.post('/api/addItem', async (req, res, next) => {

    const { userId, workout, hy, rx, item, waterAmount, date,
        time, monday, tuesday, wednesday, thursday, friday, saturday, sunday, jwtToken } = req.body;

    try      
    {        
        if( token.isExpired(jwtToken))        
        {          
            var r = {error:'The JWT is no longer valid', jwtToken: ''};          
            res.status(200).json(r);          
            return;        
        }      
    }      
    catch(e)      
    {        
        console.log(e.message);      
    }
    
    var error = '';

    // check incoming for above elaboration
    var itemfound = await getItem(userId, item);

    // calling two auxilliary functions to check if item and alarm functions already exist,
    // saving result respective variable
    if (!itemfound) {

        const itemAdd = {
            userId: userId,
            workout: workout,
            hy: hy,
            rx: rx,
            item: item,
            waterAmount: waterAmount,
            date: date
        }

        //Prepping an item package, try to see if item is added successfully into DB
        //Error string from below try catch will be appended to return status
        try {

            const db = client.db();
            db.collection('items').insertOne(itemAdd);

        } catch (e) {
            error = e.toString();
        }

        var newlyCreatedItem = await getItem(userId, item);

        // prepping an alarm package, trying to see if alarm is added successfully into DB
        // error string from below try catch will be appended to return status
        const alarmAdd = {
            userId: userId,
            itemId: newlyCreatedItem._id.toString().trim(),
            time: time,
            monday: monday,
            tuesday: tuesday,
            wednesday: wednesday,
            thursday: thursday,
            friday: friday,
            saturday: saturday,
            sunday: sunday
        }

        try {
            const db = client.db();
            db.collection('alarms').insertOne(alarmAdd);
        } catch (e) {
            error = e.toString();
        }

        // packaging return value as outgoing elaborated above
        var ret = {
            userId: userId,
            workout: workout,
            hy: hy,
            rx: rx,
            item: item,
            waterAmount: waterAmount,
            date: date,
            itemId: newlyCreatedItem._id.toString().trim(),
            time: time,
            monday: monday,
            tuesday: tuesday,
            wednesday: wednesday,
            thursday: thursday,
            friday: friday,
            saturday: saturday,
            sunday: sunday,
            error: ''
        };
    }

    // in the event getItem returns a value that isn't empty, we assume the item already exists by objectId,
    // and return the appropriate error string.
    else if (itemfound) {

        var ret = {
            userId: userId,
            workout: workout,
            hy: hy,
            rx: rx,
            item: item,
            waterAmount: waterAmount,
            date: date,
            itemId: itemfound._id.toString(),
            time: time,
            monday: monday,
            tuesday: tuesday,
            wednesday: wednesday,
            thursday: thursday,
            friday: friday,
            saturday: saturday,
            sunday: sunday,
            error: 'Item already exists'
        };
    }
    var refreshedToken = null;      
    try      
    {
        refreshedToken = token.refresh(jwtToken);      
    }      
    catch(e)      
    {        
        console.log(e.message);      
    }      
    var ret = { error: error, jwtToken: refreshedToken };
    
    // return
    res.status(200).json(ret);
});



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

// For Heroku deployment
// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('frontend/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});