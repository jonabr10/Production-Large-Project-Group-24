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
const { get } = require('http');
const client = new MongoClient(url);
client.connect();

// creating jwtToken
var token = require('./createJWT.js');

// sending emails
var emailer = require('./sendEmail.js');
const e = require('express');
const { type } = require('os');
const { query } = require('express');

// path builder
let pathBuilder = require('./frontend/src/Path');
// const { ConsoleSqlOutlined } = require('@ant-design/icons');

// Incoming: userName, email
// Outgoing: user (singular)
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

// Incoming: userId, item name
// Outgoing: item (singular)
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

// Incoming: userId, itemObjectId
// Outgoing: item (singular)
async function getItemUsingObjId(itemObjId) {

    try {
        // setup ObjectId format required for an _id (item object) search
        var ObjectId = require('mongodb').ObjectId;
        var o_id = ObjectId(itemObjId);

        const db = client.db();
        const itemResult = await db.collection('items').findOne(
            { "_id": o_id }
        )
        return itemResult;
    }
    catch (e) {
        return null;
    }
}

// Incoming: _id (alarm object),
// Outgoing: an already existing alarm (singular)
async function getAlarm(itemId) {

    try {
        // setup ObjectId format required for an _id (alarm object) search
        // var ObjectId = require('mongodb').ObjectId;
        // var o_id = ObjectId(alarmObjectId);

        var _itemId = (itemId.toString()).trim();

        const db = client.db();
        const alarmResult = await db.collection('alarms').findOne(
            { "itemId": _itemId }
        )
        return alarmResult;
    }
    catch (e) {
        return null;
    }
}

// Incoming: (item object)
// Outgoing: alarms[] (multiple)
async function getAlarms(itemObject) {

    const db = client.db();
    var _itemId = (itemObject._id.toString()).trim();

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

// Incoming: (item object)
// Outgoing: error message
// Purpose: deletes an item from the collection
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

// Incoming: (item object)
// Outgoing: error message
// Purpose: deletes an alarm (singular) from the collection
async function deleteAlarm(alarmToBeDeleted) {

    var error = '';
    try {
        const db = client.db();
        db.collection('alarms').deleteOne(
            { "_id": alarmToBeDeleted._id }
        )

    } catch (e) {
        error = e.toString();
    }

    return error;
}

// Incoming: (item object)
// Outgoing: error message
// Purpose: deletes alarms (multiple) associated to item's _id value
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

// Incoming: userId and item
// Outgoing: userId, item, deleteCount, error
// Purpose: deletes an item and validates the existence of the item and
//          also checks if this item has any alarms
app.post('/api/deleteItem', async (req, res, next) => {

    var error = '';
    var deleteCount = 0;

    const { userId, itemObjId, jwtToken } = req.body;

    // validate time remaining of JWT
    try {
        if (token.isExpired(jwtToken)) {
            var r = {
                error: 'The JWT is no longer valid',
                jwtToken: ''
            };

            res.status(200).json(r);
            return;
        }
    }
    catch (e) {
        console.log(e.message);
    }

    // check if the item exists in the database
    var itemToBeDeleted = await getItemUsingObjId(itemObjId);

    if (itemToBeDeleted) {

        // check if itemToBeDeleted have any alarms
        var doesItemToBeDeletedHaveAlarms = await getAlarms(itemToBeDeleted);

        if (doesItemToBeDeletedHaveAlarms.length > 0) {

            // update deleteCount with the current number of alarms within itemToBeDeleted, then delete all
            // the alarms associated with item object
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

    // refresh JWT
    var refreshedToken = null;

    try {
        refreshedToken = token.refresh(jwtToken);
    }
    catch (e) {
        console.log(e.message);
    }

    var ret = {
        userId: userId,
        itemObjId: itemObjId,
        deleteCount: deleteCount,
        error: error,
        jwtToken: refreshedToken
    };

    res.status(200).json(ret);
});

// Incoming: userId, _id (alarm object)
// Outgoing: userId, _id, itemId, deleteCount, error
// Purpose: deletes an alarm and validates the existence of the alarm
app.post('/api/deleteAlarm', async (req, res, next) => {

    var error = '';
    var deleteCount = 0;

    const { userId, itemId, jwtToken } = req.body;

    // validate the time remaining of JWT
    try {
        if (token.isExpired(jwtToken)) {
            var r = {
                error: 'The JWT is no longer valid',
                jwtToken: ''
            };

            res.status(200).json(r);
            return;
        }
    }
    catch (e) {
        console.log(e.message);
    }

    // check if the alarm exists in the database
    var alarmToBeDeleted = await getAlarm(itemId);

    if (alarmToBeDeleted) {
        error = await deleteAlarm(alarmToBeDeleted);
        deleteCount++;
    }

    else if (!alarmToBeDeleted) {
        error = 'Alarm does not exist';
    }

    var refreshedToken = null;

    try {
        refreshedToken = token.refresh(jwtToken);
    }
    catch (e) {
        console.log(e.message);
    }

    var ret = {
        userId: userId,
        itemId: itemId,
        deleteCount: deleteCount,
        error: error,
        jwtToken: refreshedToken
    };

    res.status(200).json(ret);
});

async function randomizeString() {

    const len = 8;
    let randString = '';

    for (var i = 0; i < len; i++) {
        const ch = Math.floor((Math.random() * 10) + 1);
        randString += ch;
    }

    console.log("<randomizeString> randomized string: " + randString);
    return randString;
}

app.get('/verify/:uniqueString', async (req, res) => {

    const { uniqueString } = req.params;
    var error = '';

    const db = client.db();
    const user = await db.collection('users').findOne(
        { "uniqueString": uniqueString }
    )

    if (user) {
        // user already validated the account
        if (user.hasValidated == true) {
            error = 'User has already validated';

            var ret = {
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.email,
                error: error,
                hasValidated: user.hasValidated,
                uniqueString: user.uniqueString
            };
        }

        // user has not validated the account
        else {
            try {
                // update hasValidated value from false to true
                const db = client.db();
                db.collection('users').updateOne(
                    { "uniqueString": uniqueString },
                    { $set: { "hasValidated": true } }
                );
            } catch (e) {
                error = e.toString();
            }

            var ret = {
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.email,
                error: error,
                hasValidated: true,
                uniqueString: user.uniqueString
            };

            var verifyPageRoute = "sign-in/";

            // TODO: change this to the login page once finished!
            return res.redirect(pathBuilder.buildPath(verifyPageRoute));
        }
    }

    else {
        error = 'User was not found';

        var ret = {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            error: error,
            hasValidated: null,
            uniqueString: uniqueString
        };
    }

    res.status(200).json(ret);
});

app.get('/reset/:uniqueString', async (req, res) => {

    const { uniqueString } = req.params;
    var error = '';

    const db = client.db();
    const user = await db.collection('users').findOne(
        { "uniqueString": uniqueString }
    )

    if (user) {
        if (user.hasValidated == true) {
            error = 'This user did not request password reset, please proceed to login';

            var ret = {
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.email,
                error: error,
                hasValidated: user.hasValidated,
                uniqueString: user.uniqueString
            };
        }

        else {
            try {
                const db = client.db();
                db.collection('users').updateOne(
                    { "uniqueString": uniqueString },
                    { $set: { "hasValidated": true } }
                );
            } catch (e) {
                error = e.toString();
            }

            var resetPageRoute = "pass-reset" + "?uniqueString=" + uniqueString;

            var ret = {
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.email,
                error: error,
                hasValidated: true,
                uniqueString: user.uniqueString
            };

            // TODO: change this to the login page once finished!
            return res.redirect(pathBuilder.buildPath(resetPageRoute));
            // return res.redirect("http://localhost:3000/" + resetPageRoute);
        }
    }

    else {
        error = 'User was not found';

        var ret = {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            error: error,
            hasValidated: null,
            uniqueString: uniqueString
        };
    }

    res.status(200).json(ret);
});

// Incoming: email
// Outgoing: email, error
// Purpose: when the user clicks on reset password button and provides an email, the
//          API will confirm the existence of the account and send the reset request
//          via email
app.post('/api/passwordResetOutgoing', async (req, res, next) => {
    const { email } = req.body;
    var error = '';

    const db = client.db();
    const user = await db.collection('users').findOne(
        { "email": email }
    )

    if (user) {
        emailer.sendResetRequest(email, user.uniqueString);

        db.collection('users').updateOne(
            { "email": email },
            { $set: { "hasValidated": false } }
        );

        var ret = {
            email: email,
            error: error
        };
    }

    else {
        error = 'No records found';

        var ret = {
            email: email,
            error: error
        };
    }

    res.status(200).json(ret);
});

// incoming: apiRoute (uniqueString), userName, password, retypePassword
// Outgoing: userName, password, retypePassword, error
// Purpose: confirms the user's uniqueString and userName prior to changing the user's password
// app.post('/api/passwordResetincoming', async (req, res, next) => {
app.post('/api/passwordResetIncoming', async (req, res, next) => {
    const { uniqueString, password } = req.body;
    var error = '';

    // find the user using uniqueString and userName
    const db = client.db();
    const user = await db.collection('users').findOne(
        { "uniqueString": uniqueString }
    )

    if (user) {

        db.collection('users').updateOne(
            { uniqueString: uniqueString },
            { $set: { "password": password } }
        );

        var ret = {
            password: password,
            uniqueString: uniqueString,
            error: error
        }

    } else {
        error = 'User does not exist';

        var ret = {
            password: password,
            uniqueString: uniqueString,
            error: error
        }
    }

    res.status(200).json(ret);
});

// Incoming: new user's firstName, lastName, userName, password, email
// Outgoing: firstName, lastName, userName, email, error
// Purpose: Registers a new user to the user collection
app.post('/api/register', async (req, res, next) => {

    const { firstName, lastName, userName, password, email } = req.body;
    var error = '';

    // Check to see if the new user already exists in the database
    var isTheNewUserDuplicate = await getUser(userName, email);

    if (!isTheNewUserDuplicate) {

        // generate the randomized string for the url account confirmation link
        const _uniqueString = await randomizeString();

        // send the email to user for account verification with the uniqueString identifier
        emailer.sendVerification(email, _uniqueString);

        const registerNewUser = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            password: password,
            email: email,
            hasValidated: false,
            uniqueString: _uniqueString
        }

        try {
            const db = client.db();
            db.collection('users').insertOne(registerNewUser);
        } catch (e) {
            error = e.toString();
        }

        var getNewUser = getUser(userName, email);

        // generates a new JWT key
        try {
            const token = require("./createJWT.js");

            jwtToken = token.createToken(
                firstName,
                lastName,
                getNewUser.userId,
                email
            );

            var ret = {
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                email: email,
                error: error,
                hasValidated: false,
                uniqueString: _uniqueString,
                jwtToken
            };
        }
        catch (e) {
            ret = {
                error: e.message
            };
        }
    }

    else if (isTheNewUserDuplicate) {
        error = 'User already exists please login instead';

        var ret = {
            firstName: isTheNewUserDuplicate.firstName,
            lastName: isTheNewUserDuplicate.lastName,
            userName: isTheNewUserDuplicate.userName,
            email: isTheNewUserDuplicate.email,
            hasValidated: isTheNewUserDuplicate.hasValidated,
            uniqueString: isTheNewUserDuplicate.uniqueString,
            error: error
        };
    }

    res.status(200).json(ret);
});

// Incoming: login, password
// Outgoing: id, firstName, lastName, email,
//           numberHy, numberWorkout, numberRx,
//           weight, desiredWeight, currentWeightDifferenceFromGoal, error
// Purpose: login for user, validates user's inputted login/password data
app.post('/api/login', async (req, res, next) => {

    const { login, password } = req.body;
    var error = '';

    const db = client.db();
    const results = await db.collection('users').find(
        { userName: login, password: password }
    ).toArray();

    var id = -1;
    var fn = '';
    var ln = '';
    var email = '';
    var weight = 0;
    var startingWeight = 0;
    var desiredWeight = 0;
    var currentWeightDifferenceFromGoal = 0;

    if (results.length > 0) {
        if (results[0].hasValidated == false) {
            var ret = {
                id: id,
                firstName: fn,
                lastName: ln,
                email: email,
                numberHy: 0,
                numberWorkout: 0,
                numberRx: 0,
                weight: weight,
                startingWeight: startingWeight,
                desiredWeight: desiredWeight,
                currentWeightDifferenceFromGoal: currentWeightDifferenceFromGoal,
                error: 'User needs to verify email.'
            };
        } else {
            // get user's credentials
            id = results[0].userId;
            fn = results[0].firstName;
            ln = results[0].lastName;
            email = results[0].email;

            // get user's count: hy, workout, and rx
            var numberHy = await countOfHy(id);
            var numberWorkout = await countOfWorkout(id);
            var numberRx = await countOfRx(id);

            // get user's weight, desiredWeight, and currentWeightDifferenceFromGoal
            const weightObj = await db.collection('weights').findOne(
                { "userId": id }
            )

            if (weightObj) {
                weight = weightObj.weight;
                startingWeight = weightObj.startingWeight;
                desiredWeight = weightObj.desiredWeight;
                currentWeightDifferenceFromGoal = Math.abs(desiredWeight - weight);
            }

            try {
                const token = require("./createJWT.js");
                jwtToken = token.createToken(fn, ln, id, email);

                var ret = {
                    id: id,
                    firstName: fn,
                    lastName: ln,
                    email: email,
                    numberHy: numberHy,
                    numberWorkout: numberWorkout,
                    numberRx: numberRx,
                    weight: weight,
                    startingWeight: startingWeight,
                    desiredWeight: desiredWeight,
                    currentWeightDifferenceFromGoal: currentWeightDifferenceFromGoal,
                    error: '',
                    jwtToken
                };

                // Debug: delete me!
                // emailer.testEmail(email);
            }
            catch (e) {
                ret = {
                    error: e.message
                };
            }
        }
    }
    else {
        var ret = {
            id: id,
            firstName: fn,
            lastName: ln,
            email: email,
            numberHy: 0,
            numberWorkout: 0,
            numberRx: 0,
            weight: weight,
            startingWeight: startingWeight,
            desiredWeight: desiredWeight,
            currentWeightDifferenceFromGoal: currentWeightDifferenceFromGoal,
            error: 'Invalid Username/Password'
        };
    }

    res.status(200).json(ret);
});

// Incoming: none
// Outgoing: current time HH:MM (string format)
async function getCurrentTime() {
    let date_ob = new Date();

    var hours = date_ob.getHours();
    var minutes = date_ob.getMinutes();

    var currentTime = (
        ('0' + hours).slice(-2) +
        ":" +
        ('0' + minutes).slice(-2)
    ).toString().trim();

    // debug: check current time
    // console.log(currentTime);

    return currentTime;
}

// Incoming: none
// Outgoing: current day [monday - sunday] (string format)
async function getCurrentDay() {
    let date_ob = new Date();

    // Sunday - Saturday : 0 - 6
    var day = date_ob.getDay();
    var stringDay = '';

    if (day == 0)
        stringDay = 'sunday';

    else if (day == 1)
        stringDay = 'monday';

    else if (day == 2)
        stringDay = 'tuesday';

    else if (day == 3)
        stringDay = 'wednesday';

    else if (day == 4)
        stringDay = 'thursday';

    else if (day == 5)
        stringDay = 'friday';

    else
        stringDay = 'saturday';

    // debug: check current time
    // console.log(stringDay + " " + typeof (stringDay));

    return stringDay;
}

// Incoming: userId
// Outgoing: all user Alarms[] scheduled to run at current time
// Purpose: provides a JSON array of all the alarms that is associated to userId value
app.post('/api/getAllUserScheduledAlarms', async (req, res, next) => {
    const { userId } = req.body;
    var error = '';

    // returns a string format of the current time GMT-0400 in HH:MM format
    var currentTime = await getCurrentTime();

    // returns a string format of the current day (monday, tuesday, etc..)
    var currentDay = await getCurrentDay();
    query[currentDay] = true;

    const db = client.db();
    const alarmResults = await db.collection('alarms').find({
        $and: [
            { "userId": userId },
            { "time": { $regex: currentTime + '.*', $options: 'r' } },
            { query }
        ]
    }).toArray();

    var _retAlarms = [];

    if (alarmResults.length > 0) {
        for (var i = 0; i < alarmResults.length; i++) {
            // get the item associated with the alarm
            var _item = await getItemUsingObjId(alarmResults[i].itemId);

            _retAlarms.push({
                userId: alarmResults[i].userId,
                item: _item.item,
                time: alarmResults[i].time
            });
        }
    }

    else {
        error = 'No records found';
    }

    var ret = {
        Alarms: _retAlarms,
        error: error
    }

    res.status(200).json(ret);
});

// Incoming: userId
// Outgoing: numberRx
async function countOfHy(userId) {

    const db = client.db();
    var numberHy = await db.collection('items').countDocuments(
        {
            $and: [
                { "userId": userId },
                { "hy": true },
                { "workout": false },
                { "rx": false },
            ]
        }
    );

    return numberHy;
}

// Incoming: userId
// Outgoing: numberHy
// Purpose: provides a total count of hydration items of userId
app.post('/api/numberOfHy', async (req, res, next) => {

    const { userId, jwtToken } = req.body;
    var error = '';

    // validate time remaining of JWT
    try {
        if (token.isExpired(jwtToken)) {
            var r = {
                error: 'The JWT is no longer valid',
                jwtToken: ''
            };

            res.status(200).json(r);
            return;
        }
    }
    catch (e) {
        console.log(e.message);
    }

    try {
        var numberHy = await countOfHy(userId);
    } catch (e) {
        error = e.message;
        console.log('<numberOfHy> Error: ' + e.message);
    }

    // refresh JWT
    var refreshedToken = null;

    try {
        refreshedToken = token.refresh(jwtToken);
    }
    catch (e) {
        console.log(e.message);
    }

    var ret = {
        numberHy: numberHy,
        error: error,
        jwtToken: refreshedToken

    }

    res.status(200).json(ret);
});

// Incoming: userId
// Outgoing: numberRx
async function countOfWorkout(userId) {

    const db = client.db();
    var numberWorkout = await db.collection('items').countDocuments(
        {
            $and: [
                { "userId": userId },
                { "hy": false },
                { "workout": true },
                { "rx": false },
            ]
        }
    );

    return numberWorkout;
}

// Incoming: userId
// Outgoing: numberHy
// Purpose: provides a total count of workout items of userId
app.post('/api/numberOfWorkout', async (req, res, next) => {

    const { userId, jwtToken } = req.body;
    var error = '';

    // validate time remaining of JWT
    try {
        if (token.isExpired(jwtToken)) {
            var r = {
                error: 'The JWT is no longer valid',
                jwtToken: ''
            };

            res.status(200).json(r);
            return;
        }
    }
    catch (e) {
        console.log(e.message);
    }

    try {
        var numberWorkout = await countOfWorkout(userId);
    } catch (e) {
        error = e.message;
        console.log('<numberOfWorkout> Error: ' + e.message);
    }

    // refresh JWT
    var refreshedToken = null;

    try {
        refreshedToken = token.refresh(jwtToken);
    }
    catch (e) {
        console.log(e.message);
    }

    var ret = {
        numberWorkout: numberWorkout,
        error: error,
        jwtToken: refreshedToken

    }

    res.status(200).json(ret);
});

// Incoming: userId
// Outgoing: numberRx
async function countOfRx(userId) {

    const db = client.db();
    var numberRx = await db.collection('items').countDocuments(
        {
            $and: [
                { "userId": userId },
                { "hy": false },
                { "workout": false },
                { "rx": true },
            ]
        }
    );

    return numberRx;
}

// Incoming: userId
// Outgoing: numberRx
// Purpose: provides a total count of rx items of userId
app.post('/api/numberOfRx', async (req, res, next) => {

    const { userId, jwtToken } = req.body;
    var error = '';

    // validate time remaining of JWT
    try {
        if (token.isExpired(jwtToken)) {
            var r = {
                error: 'The JWT is no longer valid',
                jwtToken: ''
            };

            res.status(200).json(r);
            return;
        }
    }
    catch (e) {
        console.log(e.message);
    }

    try {
        var numberRx = await countOfRx(userId);
    } catch (e) {
        error = e.message;
        console.log('<numberOfRx> Error: ' + e.message);
    }

    // refresh JWT
    var refreshedToken = null;

    try {
        refreshedToken = token.refresh(jwtToken);
    }
    catch (e) {
        console.log(e.message);
    }

    var ret = {
        numberRx: numberRx,
        error: error,
        jwtToken: refreshedToken

    }

    res.status(200).json(ret);
});

// Incoming: userId, weight, desiredWeight
// Outgoing: userId, weight, desiredWeight, error
// Purpose: adds/updates the weight and desiredWeight input to the database
app.post('/api/addWeight', async (req, res, next) => {

    const { userId, weight, startingWeight, desiredWeight, jwtToken } = req.body;
    var error = '';

    // validate time remaining of JWT
    try {
        if (token.isExpired(jwtToken)) {
            var r = {
                error: 'The JWT is no longer valid',
                jwtToken: ''
            };

            res.status(200).json(r);
            return;
        }
    }
    catch (e) {
        console.log(e.message);
    }

    // check if the user has an existing weight input
    const db = client.db();
    var sizeOfWeightCollection = await db.collection('weights').countDocuments(
        { "userId": userId }
    );

    // no existing weight
    if (sizeOfWeightCollection <= 0) {
        try {
            const newWeight = {
                userId: userId,
                weight: weight,
                startingWeight: startingWeight,
                desiredWeight: desiredWeight
            }

            db.collection('weights').insertOne(newWeight);

        } catch (e) {
            error = e.toString();
        }
    }

    // user has an existing weight, then we update the existing weight
    else {
        try {
            db.collection('weights').updateOne(
                { "userId": userId },
                {
                    $set:
                    {
                        "weight": weight,
                        "startingWeight": startingWeight,
                        "desiredWeight": desiredWeight,
                    }
                }
            );
        } catch (e) {
            error = e.toString();
        }
    }

    // refresh JWT
    var refreshedToken = null;

    try {
        refreshedToken = token.refresh(jwtToken);
    }
    catch (e) {
        console.log(e.message);
    }

    var ret = {
        userId: userId,
        weight: weight,
        startingWeight: startingWeight,
        desiredWeight: desiredWeight,
        error: error,
        jwtToken: refreshedToken
    };

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

// incoming: userId
// Outgoing: userId, desiredWeight (most recent add), currentWeightDifferenceFromGoal (abs value),
//           percentageFromWeightGoal, arrayOfWeight[]
app.post('/api/outputWeight', async (req, res, next) => {

    const { userId, jwtToken } = req.body;
    var error = '';

    // validate time remaining of JWT
    try {
        if (token.isExpired(jwtToken)) {
            var r = {
                error: 'The JWT is no longer valid',
                jwtToken: ''
            };

            res.status(200).json(r);
            return;
        }
    }
    catch (e) {
        console.log(e.message);
    }

    const db = client.db();
    var sizeOfWeightCollection = await db.collection('weights').countDocuments(
        { "userId": userId }
    );

    // in the event that the user has not inputted any weights, then we need to add first
    if (sizeOfWeightCollection <= 0) {
        var ret = {
            userId: userId,
            weight: 0,
            startingWeight: 0,
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
        try {
            refreshedToken = token.refresh(jwtToken);
        }
        catch (e) {
            console.log(e.message);
        }

        var ret = {
            userId: userId,
            weight: arrayOfWeight[0].weight,
            startingWeight: arrayOfWeight[0].startingWeight,
            currentdesiredWeight: arrayOfWeight[0].desiredWeight,
            currentWeightDifferenceFromGoal: weightDiffFromGoal,
            percentageOfWeightChange: percentageOfWeightChange,
            arrayOfWeight: arrayOfWeight,
            error: "",
            jwtToken: refreshedToken
        }
    }

    res.status(200).json(ret);
});

// Incoming: ObjectId for Item, userId, workout, hy, rx, item name, water amount, objectId for the alarm, time,
//           monday - sunday boolean variables
// Outgoing: ObjectId for Item  , userId , workout, hy, rx , item name, waterAmount, Alarmid ,itemId, time,
//           monday - sunday boolean values, error string
app.post('/api/addItem', async (req, res, next) => {

    const {
        userId,
        workout,
        hy,
        rx,
        item,
        waterAmount,
        time,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        jwtToken
    } = req.body;

    var error = '';

    // validate time remaining of JWT
    try {
        if (token.isExpired(jwtToken)) {
            var r = {
                error: 'The JWT is no longer valid',
                jwtToken: ''
            };

            res.status(200).json(r);
            return;
        }
    }
    catch (e) {
        console.log(e.message);
    }

    const itemAdd = {
        userId: userId,
        workout: workout,
        hy: hy,
        rx: rx,
        item: item,
        waterAmount: waterAmount
    }

    //Prepping an item package, try to see if item is added successfully into DB
    //Error string from below try catch will be appended to return status
    try {
        const db = client.db();
        var _itemObj = db.collection('items').insertOne(itemAdd);

    } catch (e) {
        error = e.toString();
    }

    var newlyCreatedItem = await getItemUsingObjId((await _itemObj).insertedId);

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

    // refresh JWT
    var refreshedToken = null;

    try {
        refreshedToken = token.refresh(jwtToken);
    }
    catch (e) {
        console.log(e.message);
    }

    // packaging return value as outgoing elaborated above
    var ret = {
        userId: userId,
        workout: workout,
        hy: hy,
        rx: rx,
        item: item,
        waterAmount: waterAmount,
        itemId: newlyCreatedItem._id.toString().trim(),
        time: time,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday,
        error: error,
        jwtToken: refreshedToken
    };

    // return
    res.status(200).json(ret);
});

// Incoming: item id, item name, rx, hy, workout, time ,monday - sunday boolean vals
// Outgoing: UPDATED VALUES IN SAME FORMAT ABOVE
app.post('/api/editItem', async (req, res, next) => {

    const {
        userId,
        itemId,
        item,
        rx,
        hy,
        workout,
        waterAmount,
        time,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        jwtToken
    } = req.body;

    var error = '';

    // validate time remaining of JWT
    try {
        if (token.isExpired(jwtToken)) {
            var r = {
                error: 'The JWT is no longer valid',
                jwtToken: ''
            };

            res.status(200).json(r);
            return;
        }
    }
    catch (e) {
        console.log(e.message);
    }

    var itemretrieved = await getItemUsingObjId(itemId);

    if (itemretrieved != null) {

        try {
            var ObjectId = require('mongodb').ObjectId;
            var o_id = ObjectId(itemId);

            const db = client.db();

            db.collection('items').updateOne(
                { _id: o_id },
                {
                    $set: {
                        "item": item,
                        "rx": rx,
                        "hy": hy,
                        "workout": workout,
                        "waterAmount": waterAmount
                    }
                }
            );

            db.collection('alarms').updateOne(
                { itemId: itemId },
                {
                    $set: {
                        "time": time,
                        "monday": monday,
                        "tuesday": tuesday,
                        "wednesday": wednesday,
                        "thursday": thursday,
                        "friday": friday,
                        "saturday": saturday,
                        "sunday": sunday
                    }
                }
            );

        } catch (e) {
            error = e.toString();
        }

        // refresh JWT
        var refreshedToken = null;

        try {
            refreshedToken = token.refresh(jwtToken);
        }
        catch (e) {
            console.log(e.message);
        }

        var ret = {
            item: item,
            rx: rx,
            hy: hy,
            workout: workout,
            time: time,
            monday: monday,
            tuesday: tuesday,
            wednesday: wednesday,
            thursday: thursday,
            friday: friday,
            saturday: saturday,
            sunday: sunday,
            error: error,
            jwtToken: refreshedToken
        };
    }

    // Return values updated with error string declaring item not found
    else if (itemretrieved == null) {

        var ret = {
            item: item,
            rx: rx,
            hy: hy,
            workout: workout,
            time: time,
            monday: monday,
            tuesday: tuesday,
            wednesday: wednesday,
            thursday: thursday,
            friday: friday,
            saturday: saturday,
            sunday: sunday,
            error: "Item returned null"
        };
    }

    res.status(200).json(ret);
});

// Incoming: userId, search
// Outgoing: results[], error
// Purpose:  searches the database based on the userId and item (item name)
app.post('/api/search', async (req, res, next) => {

    const { userId, search, jwtToken } = req.body;
    var error = '';

    // validate time remaining of JWT
    try {
        if (token.isExpired(jwtToken)) {
            var r = {
                error: 'The JWT is no longer valid',
                jwtToken: ''
            };

            res.status(200).json(r);
            return;
        }
    }
    catch (e) {
        console.log(e.message);
    }

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

        // refresh JWT
        var refreshedToken = null;

        try {
            refreshedToken = token.refresh(jwtToken);
        }
        catch (e) {
            console.log(e.message);
        }

        var ret = {
            results: _ret,
            error: error,
            jwtToken: refreshedToken
        };

        res.status(200).json(ret);
    }

    else {
        // refresh JWT
        var refreshedToken = null;

        try {
            refreshedToken = token.refresh(jwtToken);
        }
        catch (e) {
            console.log(e.message);
        }

        var ret = {
            results: _ret,
            error: "No records found",
            jwtToken: refreshedToken
        };

        res.status(200).json(ret);
    }

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

// ==========
// mobile app
// ==========

// Incoming: userId, search
// Outgoing: results[], error
// Purpose:  searches the database based on the userId and item (item name)
app.post('/api/searchMobile', async (req, res, next) => {

    const { userId, search } = req.body;
    var error = '';

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

        var ret = {
            results: _ret,
            error: error,
        };

        res.status(200).json(ret);
    }

    else {
        // refresh JWT
        var refreshedToken = null;

        try {
            refreshedToken = token.refresh(jwtToken);
        }
        catch (e) {
            console.log(e.message);
        }

        var ret = {
            results: _ret,
            error: "No records found",
            jwtToken: refreshedToken
        };

        res.status(200).json(ret);
    }

});

// Incoming: userId
// Outgoing: all user Alarms[] w/ userId
// Purpose: provides a JSON array of all the alarms that is associated to userId value
app.post('/api/getAllUserAlarmsMobile', async (req, res, next) => {

    const { userId } = req.body;
    var error = '';

    const db = client.db();
    const alarmResults = await db.collection('alarms').find(
        { "userId": userId }
    ).toArray();

    var _retAlarms = [];

    if (alarmResults.length > 0) {

        for (var i = 0; i < alarmResults.length; i++) {

            var itemObj = await getItemUsingObjId(alarmResults[i].itemId);

            _retAlarms.push({
                _id: alarmResults[i]._id,
                userId: alarmResults[i].userId,
                itemId: alarmResults[i].itemId,
                item: itemObj.item,
                workout: itemObj.workout,
                rx: itemObj.rx,
                hy: itemObj.hy,
                waterAmount: itemObj.waterAmount,
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

        var ret = {
            Alarms: _retAlarms,
            error: error
        };

        res.status(200).json(ret);
    }

    else {
        error = "No records found";

        var ret = {
            results: _retAlarms,
            error: error
        };

        res.status(200).json(ret);
    }
});


// Incoming: userId
// Outgoing: all user rxAlarms[] w/ userId
// Purpose: provides a JSON array of all the rx alarms that is associated to userId value
app.post('/api/getAllRxAlarmsMobile', async (req, res, next) => {

    const { userId } = req.body;
    var error = '';

    const db = client.db();
    const itemResults = await db.collection('items').find({
        $and: [
            { "userId": userId },
            { "rx": true }
        ]
    }).toArray();

    var _ret = [];

    if (itemResults.length > 0) {

        for (var i = 0; i < itemResults.length; i++) {

            var _itemId = itemResults[i]._id.toString().trim();

            const alarmResult = await db.collection('alarms').findOne({
                $and: [
                    { "userId": userId },
                    { "itemId": _itemId }
                ]
            })

            _ret.push({
                _id: itemResults[i]._id,
                userId: itemResults[i].userId,
                itemId: alarmResult.itemId,
                item: itemResults[i].item,
                rx: itemResults[i].rx,
                time: alarmResult.time,
                monday: alarmResult.monday,
                tuesday: alarmResult.tuesday,
                wednesday: alarmResult.wednesday,
                thursday: alarmResult.thursday,
                friday: alarmResult.friday,
                saturday: alarmResult.saturday,
                sunday: alarmResult.sunday
            });
        }

        var ret = {
            Alarms: _ret,
            error: error
        };

        res.status(200).json(ret);
    }

    else {
        error = "No records found";

        var ret = {
            results: _ret,
            error: error
        };

        res.status(200).json(ret);
    }
});

// Incoming: userId
// Outgoing: all user workoutAlarms[] w/ userId
// Purpose: provides a JSON array of all the workout alarms that is associated to userId value
app.post('/api/getAllWorkoutAlarmsMobile', async (req, res, next) => {

    const { userId } = req.body;
    var error = '';

    const db = client.db();
    const itemResults = await db.collection('items').find({
        $and: [
            { "userId": userId },
            { "workout": true }
        ]
    }).toArray();

    var _ret = [];

    if (itemResults.length > 0) {

        for (var i = 0; i < itemResults.length; i++) {

            var _itemId = itemResults[i]._id.toString().trim();

            const alarmResult = await db.collection('alarms').findOne({
                $and: [
                    { "userId": userId },
                    { "itemId": _itemId }
                ]
            })

            _ret.push({
                _id: itemResults[i]._id,
                userId: itemResults[i].userId,
                itemId: alarmResult.itemId,
                item: itemResults[i].item,
                workout: itemResults[i].workout,
                time: alarmResult.time,
                monday: alarmResult.monday,
                tuesday: alarmResult.tuesday,
                wednesday: alarmResult.wednesday,
                thursday: alarmResult.thursday,
                friday: alarmResult.friday,
                saturday: alarmResult.saturday,
                sunday: alarmResult.sunday
            });
        }

        var ret = {
            Alarms: _ret,
            error: error
        };

        res.status(200).json(ret);
    }

    else {
        error = "No records found";

        var ret = {
            results: _ret,
            error: error
        };

        res.status(200).json(ret);
    }
});

// Incoming: userId
// Outgoing: all user HyAlarms[] w/ userId
// Purpose: provides a JSON array of all the hy alarms that is associated to userId value
app.post('/api/getAllHyAlarmsMobile', async (req, res, next) => {

    const { userId } = req.body;
    var error = '';

    const db = client.db();
    const itemResults = await db.collection('items').find({
        $and: [
            { "userId": userId },
            { "hy": true }
        ]
    }).toArray();

    var _ret = [];

    if (itemResults.length > 0) {

        for (var i = 0; i < itemResults.length; i++) {

            var _itemId = itemResults[i]._id.toString().trim();

            const alarmResult = await db.collection('alarms').findOne({
                $and: [
                    { "userId": userId },
                    { "itemId": _itemId }
                ]
            })

            _ret.push({
                _id: itemResults[i]._id,
                userId: itemResults[i].userId,
                itemId: alarmResult.itemId,
                item: itemResults[i].item,
                hy: itemResults[i].hy,
                waterAmount: itemResults[i].waterAmount,
                time: alarmResult.time,
                monday: alarmResult.monday,
                tuesday: alarmResult.tuesday,
                wednesday: alarmResult.wednesday,
                thursday: alarmResult.thursday,
                friday: alarmResult.friday,
                saturday: alarmResult.saturday,
                sunday: alarmResult.sunday
            });
        }

        var ret = {
            Alarms: _ret,
            error: error
        };

        res.status(200).json(ret);
    }

    else {
        error = "No records found";

        var ret = {
            results: _ret,
            error: error
        };

        res.status(200).json(ret);
    }
});

// Incoming: userId
// Outgoing: percentage different from current weight to desired weight
// Purpose: Calculates the percentage difference from current weight to desired weight
app.post('/api/getPercentageDifferenceMobile', async (req, res, next) => {

    const { userId } = req.body;
    var error = '';

    var result = 0;
    var startingWeight = 0;
    var desiredWeight = 0;
    var currentWeight = 0;

    const db = client.db();
    var weightObj = await db.collection('weights').findOne(
        { "userId": userId }
    )

    if (weightObj) {
        startingWeight = weightObj.startingWeight;
        desiredWeight = weightObj.desiredWeight;
        currentWeight = weightObj.weight;

        console.log(startingWeight + " " + desiredWeight + " " + currentWeight);

        let diff1 = Math.abs(startingWeight - desiredWeight);
        let diff2 = Math.abs(startingWeight - currentWeight);
        let result = Math.round(diff2 / diff1 * 100);

        var ret = {
            result: result,
            error: error
        };


    } else {
        error = "No records found";

        var ret = {
            result: result,
            error: error
        };
    }

    res.status(200).json(ret);
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
