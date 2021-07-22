//incoming: item id, item name, rx, hy, workout, time ,monday - sunday boolean vals
//outgoing: UPDATED VALUES IN SAME FORMAT ABOVE

app.post('/api/editItem', async(req, res, next) => {

    const {itemId, item, rx, hy, workout, time, monday, tuesday, wednesday, thursday, friday, saturday, sunday} = req.body;
    var error = '';

    //Initiate error string and attempt to retrieve both item and alarm

    var itemretrieved = getItem(itemId);
    var alarmretrieved = getAlarm(itemId);

    //In the event both the item and alarm have been successfully retrieved...

    if (itemretrieved != null && alarmretrieved != null){

        //Update item object's and alarm object's returned properties with new updated values from parameters

        itemretrieved.item = item;
        itemretrieved.rx = rx;
        itemretrieved.hy = hy;
        itemretrieved.workout = workout;

        alarmretrieved.time = time;
        alarmretrieved.monday = monday;
        alarmretrieved.tuesday = tuesday;
        alarmretrieved.wednesday = wednesday;
        alarmretrieved.thursday = thursday;
        alarmretrieved.friday = friday;
        alarmretrieved.saturday = saturday;
        alarmretrieved.sunday = sunday;

        //Attempt to connect to DB to push both item and alarm as an update.

        try {

            const db = client.db();
            db.collection('items').updateOne(itemretrieved);
            db.collection('alarms').updateOne(alarmretrieved);
    
        } catch (e) {
    
            error = e.toString();
        }

        //Append any error string in event of catch exception

        var ret = {item: item, rx: rx, hy: hy, workout: workout, time: time,monday : monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday, error: error };

    }

    //return values both missing if neither object found
    else if (itemretrieved == null && alarmretrieved == null){

        var ret = {item: item, rx: rx, hy: hy, workout: workout, time: time,monday : monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday, error: 'Both alarm and item returned null value' };

    }

    
    //Return values updated with error string declaring item not found
   else if (itemretrieved == null){
    
    var ret = {item: item, rx: rx, hy: hy, workout: workout, time: time, monday : monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday, error: 'Item returned null value' };

   }

       //Return values updated with error string declaring alarm not found

   else if (alarmretrieved == null){

    var ret = {item: item, rx: rx, hy: hy, workout: workout, time: time,monday : monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday, error: 'Alarm returned null value' };

   }

   res.status(200).json(ret);

});