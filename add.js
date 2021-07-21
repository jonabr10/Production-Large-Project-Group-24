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


// Incoming: ObjectId for Item, userId, workout, hy, rx, item name, water amount, objectId for the alarm, time, monday - sunday boolean variables
// Outgoing:  ObjectId for Item  , userId , workout, hy, rx , item name, waterAmount, Alarmid ,itemId, time, monday - sunday boolean values, error string

app.post('/api/addItem' , async (req, res, next) => {

    const { _id, userId, workout, hy, rx, item, waterAmount, _aid, time, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;

    //Check Incoming for above elaboration

    var itemfound = await getItem(userId, item);
    var alarmfound = await getAlarms(_id)

    //Calling two auxilliary functions to check if item and alarm functions already exist, saving result respective variable


    
    if (itemfound.length == 0 && alarmfound.length == 0) {

        const itemadd = {_id : _id , userId : userId, workout : workout, hy : hy, rx : rx, item : item, waterAmount : waterAmount}
        var error = '';

        //Prepping an item package, try to see if item is added successfully into DB
        //Error string from below try catch will be appended to return status

        try {

            const db = client.db();
            db.collection('items').insertOne(itemadd);

        } catch (e) {

            error = e.toString();
        }

        //Prepping an alarm package, trying to see if alarm is added successfully into DB
        //Error string from below try catch will be appended to return status
        const alarmadd = {_id: _aid, userId : userId, itemId : _id, time : time , monday : monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday}
        var error = '';

        
        try {

            const db = client.db();
            db.collection('alarms').insertOne(alarmadd);

        } catch (e) {

            error = e.toString();
        }


        //Packaging return value as outgoing elaborated above 

        var ret = { _id : _id , userId : userId, workout : workout, hy : hy, rx : rx, item : item, waterAmount : waterAmount, _id: _aid ,itemId : _id, time : time , monday : monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday, error: '' };
    }

    //In the event getItem returns a value that isn't empty, we assume the item already exists by objectId, and return the appropriate error string.
    else if (itemfound.length > 0) {

        var ret = { _id : _id , userId : userId, workout : workout, hy : hy, rx : rx, item : item, waterAmount : waterAmount, _id: _aid ,itemId : _id, time : time , monday : monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday, error: 'Item already exists' };
    }


    //In the event getAlarms returns a value that isn't empty, we assume the alarm already exists by itemId, and return the appropriate error string.
    else if (alarmfound.length > 0){

        var ret = {_id : _id , userId : userId, workout : workout, hy : hy, rx : rx, item : item, waterAmount : waterAmount, _id: _aid ,itemId : _id, time : time , monday : monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday, error: 'Alarm already exists' };

    }

    //Return 
    res.status(200).json(ret);

    
});


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

