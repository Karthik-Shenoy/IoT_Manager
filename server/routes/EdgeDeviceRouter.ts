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
const EdgeDeviceRouter = express.Router();
EdgeDeviceRouter.use(express.json());

const connectionString = 'HostName=DummyHub77.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=MaZpu9OyelWoRacIGoKSsXHo5GizaVeDuQcDX5BYh4c=';
const registry = iothub.Registry.fromConnectionString(connectionString);

const uri = "mongodb+srv://karthik:hello123@sensorflow.lirh05g.mongodb.net";
const client = new MongoClient(uri);


// we will mount this router at /resources end point, any requests coming in will goto /resources/
EdgeDeviceRouter.route('/create')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .put(async (req, res, next) => {

    })
    .post((req, response, next) => {



        function createDevice() {

            // Create a new device
            var device = {
                deviceId: 'sample-device-' + Date.now()
            };

            registry.create(device, async function (err, deviceInfo, res) {
                if (err) console.log(' error: ' + err.toString());
                if (res) console.log(' status: ' + res.statusCode + ' ' + res.statusMessage);
                if (deviceInfo) {
                    //console.log(' device info: ' + JSON.stringify(deviceInfo));
                    const createAndInsertDeviceInDatabase = async () => {
                        const endpoint = req.body.deviceConnectionKey;
                        // change edge ip here
                        const response = await fetch(`http://192.168.6.119:1880/${endpoint}`, {
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

                        await client.connect()
                        await client.db("Users").collection("EdgeDevices").insertOne(newDevice)

                        return;

                    }
                    try {
                        createAndInsertDeviceInDatabase()
                    }
                    catch (error) {
                        console.error("\n error when creating a device \n", error);
                        response.status(500);
                        res.send("Something Went Wrong");
                    }
                    finally {
                        console.log("sucessfully created a device")
                        await client.close();
                    }
                }
            });
        }

        try {
            createDevice();
        } catch (error) {
            console.log("error wen creating a device : ", error);
        }

    })
    .get((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /resources ")
    })
    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end("Delete operation not supported on /resources ")
    });


EdgeDeviceRouter.route("/:userUID")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(async (req, res, next) => {
        async function getEdgeDeviceList() {

            await client.connect();
            const deviceCursor = client.db("Users").collection("EdgeDevices").find({ UID: req.params.userUID });

            let deviceLst: any[] = await deviceCursor.toArray()
            res.status(200);
            res.send(JSON.stringify({ devices: deviceLst }));
            console.log("/resource/userUid Got All the Edge Devices ; ");

        }
        try {
            getEdgeDeviceList()
        } catch (error) {
            console.log("error when retrieving Edge Devices", error);
        } finally {
            await client.close()
        }
    }).delete(async (req, res, next) => {
        try {
            const reqBody = req.body;
            console.log(reqBody);
            registry.delete(reqBody.deviceId, async (err, nullResponse, result) => {
                console.log(err, nullResponse, result)
                if (err) console.log(' error: ' + err.toString());
                if (result) {
                    console.log(' status: ' + result.statusCode + ' ' + result.statusMessage);
                    const deleteDevice = async () => {
                        await client.connect();
                        let deleteLog = await client.db("Users").collection("EdgeDevices").deleteOne({ deviceId: reqBody.deviceId });
                        deleteLog = await client.db("Usets").collection("SensorData").deleteMany({ deviceId: reqBody.deviceId });
                        deleteLog = await client.db("Usets").collection("ProvisionedSensors").deleteMany({ deviceId: reqBody.deviceId });
                        res.send(JSON.stringify({
                            log: deleteLog
                        }));
                    }
                    deleteDevice();
                }
            })

        } catch (error) {
            console.error("\n error when deleting edge \n ");
            res.status(500);
            res.send(JSON.stringify({
                error: "error when deleting the edge device"
            }));
        }
        finally {
            await client.close();
        }
    })

export default EdgeDeviceRouter;


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