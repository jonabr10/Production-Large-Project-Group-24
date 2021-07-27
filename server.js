// Initialize everything 
// Done below 
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
const { text } = require('express');
const client = new MongoClient(url);
client.connect();

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

    const { userId, item } = req.body;

    // check if the item exists in the database
    var itemToBeDeleted = await getItem(userId, item);

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

    var ret = { userId: userId, item: item, deleteCount: deleteCount, error: error };
    res.status(200).json(ret);
});

// Incoming: userId, _id (alarm object)
// Outgoing: userId, _id, itemId, deleteCount, error
// Purpose: deletes an alarm and validates the existence of the alarm
app.post('/api/deleteAlarm', async (req, res, next) => {
    var error = '';
    var deleteCount = 0;

    const { userId, itemId } = req.body;

    // check if the alarm exists in the database
    var alarmToBeDeleted = await getAlarm(itemId);

    if (alarmToBeDeleted) {
        error = await deleteAlarm(alarmToBeDeleted);
        deleteCount++;
    }

    else if (!alarmToBeDeleted) {
        error = 'Alarm does not exist';
    }

    var ret = { userId: userId, itemId: itemId, deleteCount: deleteCount, error: error };
    res.status(200).json(ret);
});

// Incoming: new user's firstName, lastName, userName, password, email
// Outgoing: firstName, lastName, userName, email, error 
// Purpose: Registers a new user to the user collection
app.post('/api/register', async (req, res, next) => {

    const { firstName, lastName, userName, password, email } = req.body;

    // Check to see if the new user already exists in the database
    var isTheNewUserDuplicate = await getUser(userName, password);

    if (!isTheNewUserDuplicate) {

        const registerNewUser = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            password: password,
            email: email
        }

        var error = '';

        try {
            const db = client.db();
            db.collection('users').insertOne(registerNewUser);
        } catch (e) {
            error = e.toString();
        }

        var ret = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            error: error
        };
    }

    else if (isTheNewUserDuplicate) {

        var ret = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            error: 'User already exists please login instead'
        };
    }

    res.status(200).json(ret);
});

// Incoming: login, password
// Outgoing: id, firstName, lastName, email, error
// Purpose: login for user, validates user's inputted login/password data
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

// Incoming: userId
// Outgoing: all user Alarms[] w/ userId
// Purpose: provides a JSON array of all the alarms that is associated to userId value
app.post('/api/getAllUserAlarms', async (req, res, next) => {

    const { userId } = req.body;

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

        var ret = { Alarms: _retAlarms, error: " " };
        res.status(200).json(ret);
    }

    else {
        var ret = { results: _ret, error: "No records found" };
        res.status(200).json(ret);
    }
});

// Incoming: userId, weight, date, desiredWeight
// Outgoing: userId, weight, date, desiredWeight, error
// Purpose: adds a new weight and desiredWeight input to the database
app.post('/api/addWeight', async (req, res, next) => {

    const { userId, weight, date, desiredWeight } = req.body;
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

    const { userId } = req.body;
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

        var ret = {
            userId: userId,
            currentdesiredWeight: arrayOfWeight[0].desiredWeight,
            currentWeightDifferenceFromGoal: weightDiffFromGoal,
            percentageOfWeightChange: percentageOfWeightChange,
            arrayOfWeight: arrayOfWeight,
            error: ""
        }
    }

    res.status(200).json(ret);
});

// Incoming: ObjectId for Item, userId, workout, hy, rx, item name, water amount, objectId for the alarm, time, 
//           monday - sunday boolean variables
// Outgoing: ObjectId for Item  , userId , workout, hy, rx , item name, waterAmount, Alarmid ,itemId, time, 
//           monday - sunday boolean values, error string
app.post('/api/addItem', async (req, res, next) => {

    const { userId, workout, hy, rx, item, waterAmount, date,
        time, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;

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

    // return 
    res.status(200).json(ret);
});

// Incoming: item id, item name, rx, hy, workout, time ,monday - sunday boolean vals
// Outgoing: UPDATED VALUES IN SAME FORMAT ABOVE
app.post('/api/editItem', async (req, res, next) => {

    const { userId, item, rx, hy, workout, time, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;
    var error = '';

    // Initiate error string and attempt to retrieve both item and alarm

    var itemretrieved = await getItem(userId, item);
        

    // In the event both the item and alarm have been successfully retrieved...

    if (itemretrieved != null) {

        // Update item object's and alarm object's returned properties with new updated values from parameters
        const itemId = itemretrieved._id;
        var alarmretrieved = await getAlarm(itemId);

        var updatedItem = itemretrieved;

        updatedItem.item = item;
        updatedItem.rx = rx;
        updatedItem.hy = hy;
        updatedItem.workout = workout;

        var updatedAlarm = alarmretrieved;

        updatedAlarm.time = time;
        updatedAlarm.monday = monday;
        updatedAlarm.tuesday = tuesday;
        updatedAlarm.wednesday = wednesday;
        updatedAlarm.thursday = thursday;
        updatedAlarm.friday = friday;
        updatedAlarm.saturday = saturday;
        updatedAlarm.sunday = sunday;

        
        
    
        var setitem = 
        {
            $set: updatedItem
        }
        var setalarm = {
            $set: updatedAlarm
        }

        // Attempt to connect to DB to push both item and alarm as an update.

        try {

            const db = client.db();

            db.collection('items').updateOne({userId: userId} , setitem);
            db.collection('alarms').updateOne({itemId: itemId} , setalarm);

        } catch (e) {

            error = e.toString();
        }

        // Append any error string in event of catch exception

        var ret = { item: item, 
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
                error: error };

    }


    // Return values updated with error string declaring item not found
    else if (itemretrieved == null) {

        var ret = { item: item, 
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
            error: "Item returned null" };
    }

    // Return values updated with error string declaring alarm not found

    else if (alarmretrieved == null) {

        var ret = { item: item, 
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
            error: "Alarm returned null" };
    }

    res.status(200).json(ret);
});



// Incoming: userId, search
// Outgoing: results[], error
// Purpose:  searches the database based on the userId and item (item name)
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