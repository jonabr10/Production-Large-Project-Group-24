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

// 3 categories:
// - Workout 
// - prescription
// - hydration

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

        var ret = { id: id, firstName: fn, lastName: ln, email: email, error: '' };
    }

    else if (results.length <= 0) {
        var ret = { id: id, firstName: fn, lastName: ln, email: email, error: 'Invalid Username/Password' };
    }

    res.status(200).json(ret);
});

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

// Incoming: item objects
// Outgoing: alarms[]
async function getItem(userId, itemName) {

    const db = client.db();
    var _item = (itemName.toString()).trim();

    const itemResults = await db.collection('items').find(
        {
            $and: [
                { "userId": userId },
                { "item": _item }
            ]
        }
    ).toArray();

    var _retItems = [];

    for (var i = 0; i < itemResults.length; i++) {
        _retItems.push({
            _id: itemResults[i]._id,
            userId: itemResults[i].userId,
            item: itemResults[i].item,
            tracker: itemResults[i].tracker,
        });
    }

    return _retItems;
}

// Incoming: item objects
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

// Incoming: userId, search
// Outgoing: results[], error
app.post('/api/search', async (req, res, next) => {

    var error = '';
    const { userId, search } = req.body;

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

            if (itemResults[i].tracker == true) {

                var _alarms = await getAlarms(itemResults[i]);

                _ret.push({
                    _id: itemResults[i]._id,
                    userId: itemResults[i].userId,
                    item: itemResults[i].item,
                    tracker: itemResults[i].tracker,
                    alarms: _alarms
                });
            }

            else if (itemResults[i].tracker == false) {
                _ret.push({
                    _id: itemResults[i]._id,
                    userId: itemResults[i].userId,
                    item: itemResults[i].item,
                    tracker: itemResults[i].tracker,
                });
            }
        }

        var ret = { results: _ret, error: error };
        res.status(200).json(ret);
    }

    else {
        var ret = { results: _ret, error: "No records found" };
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

// This is a test after pulling from master!
