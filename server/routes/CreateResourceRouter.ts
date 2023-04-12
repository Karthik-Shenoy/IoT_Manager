import express from 'express';
import iothub from 'azure-iothub'
import { MongoClient } from 'mongodb';
//import mongoose from "mongoose";
//import { ObjectId } from 'mongodb';

/*
// Define connection string
const uri = "mongodb://0.0.0.0:27017/portfolio";

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected…");
    })
    .catch(err => console.log(err));

// Define a schema
const ResourceSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    sub_topics: Array
});


// Create a model
const Resource = mongoose.model("resources", ResourceSchema);
*/

// Create an express app and use JSON middleware
const CreateResourceRouter = express.Router();
CreateResourceRouter.use(express.json());


// we will mount this router at /resources end point, any requests coming in will goto /resources/
CreateResourceRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .put(async (req, res, next) => {

    })
    .post((req, res, next) => {

        var connectionString = 'HostName=DummyHub77.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=MaZpu9OyelWoRacIGoKSsXHo5GizaVeDuQcDX5BYh4c=';

        var registry = iothub.Registry.fromConnectionString(connectionString);

        const uri = "mongodb+srv://karthik:hello123@sensorflow.lirh05g.mongodb.net";
        const client = new MongoClient(uri);



        // Create a new device
        var device = {
            deviceId: 'sample-device-' + Date.now()
        };

        registry.create(device, function (err, deviceInfo, res) {
            if (err) console.log(' error: ' + err.toString());
            if (res) console.log(' status: ' + res.statusCode + ' ' + res.statusMessage);
            if (deviceInfo) {
                //console.log(' device info: ' + JSON.stringify(deviceInfo));
                const createDevice = async () => {
                    const endpoint = req.body.deviceConnectionKey;
                    const response = await fetch(`http://127.0.0.1:1880/${endpoint}`, {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-type": "application/json; charset=UTF-8"
                        },
                        body: JSON.stringify({
                            deviceId: deviceInfo.deviceId,
                            key: deviceInfo.authentication?.symmetricKey?.primaryKey,
                            deviceName: req.body.deviceName
                        })
                    });

                    const responseVal = await response.text();
                    //console.log(responseVal)

                    const newDevice = {
                        UID: req.body.UID,
                        deviceName: req.body.deviceName,
                        deviceId: deviceInfo.deviceId,
                        key: deviceInfo.authentication?.symmetricKey?.primaryKey
                    }

                    client.connect().then(() => {
                        client.db("Users").collection("EdgeDevices").insertOne(newDevice);
                        console.log("success")
                    });


                }
                createDevice();
            }
        });

    })
    .get((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /resources ")
    })
    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end("Delete operation not supported on /resources ")
    });

CreateResourceRouter.route("/:userUID")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get((req, res, next) => {
        const uri = "mongodb+srv://karthik:hello123@sensorflow.lirh05g.mongodb.net";
        const client = new MongoClient(uri);
        client.connect().then(() => {
            const deviceCursor = client.db("Users").collection("EdgeDevices").find({ UID: req.params.userUID });
            let deviceLst: any[] = [];
            deviceCursor.toArray().then((result) => {
                deviceLst = result;
                res.status(200);
                res.send(JSON.stringify({ devices: deviceLst }));
            }).then(()=>{
                console.log("/resource/userUid Got All the Edge Devices ; ")
                client.close();
            })
        });
    })

export default CreateResourceRouter;


/*
app.all('/resources/:resourceId', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});

app.get('/resources/:resourceId', (req, res, next) => {
    res.end("dishe sent : " + req.params.resourceId);
});

app.post('/resources/:resourceId', (req, res, next) => {
    res.statusCode = 403
    res.end("POST operation not supported on /resources/:resourceId");
});
 
app.put('/resources/:resourceId', (req, res, next) => {
    res.end("PUT operation sucessful ");
});

app.delete('/resources/:resourceId', (req, res, next) => {
    res.end("Delete operation successful ");
});
*/