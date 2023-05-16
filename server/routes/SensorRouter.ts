import express from 'express';
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
const sensorRouter = express.Router();
sensorRouter.use(express.json());
const uri = "mongodb+srv://karthik:hello123@sensorflow.lirh05g.mongodb.net";
const client = new MongoClient(uri);


sensorRouter.route("/:deviceId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get((req, res, next) => {

        const processGetSensorList = async () => {
            try {
                await client.connect();
                const sensorDeviceCursor = client.db("Users").collection("SensorData").find({ deviceId: req.params.deviceId });
                const provisonedCursor = client.db("Users").collection("ProvisionedSensors").find({ deviceId: req.params.deviceId });
                const sensorDeviceList = await sensorDeviceCursor.toArray();
                const provisonedList = await provisonedCursor.toArray();
                res.status(200);
                res.send(JSON.stringify({
                    devices: sensorDeviceList,
                    provisonedSensors: provisonedList
                }));
                console.info("/sensor/deviceid sensor devices sent ; ");
            } catch (error) {
                console.error("\n error when retrieving sensors devices : \n", error);
                res.status(500);
                res.send("Something went wrong");
            } finally {
                client.close();
            }
        };

        processGetSensorList();


    }).post((req, res, next) => {
        const processProvisonSensor = async () => {
            try {
                await client.connect();
                const result = await client.db("Users").collection("ProvisionedSensors").insertOne({
                    deviceId: req.params.deviceId,
                    sensorId: req.body.sensorId
                })
                res.status(200);
                res.send(JSON.stringify({
                    log: result,
                }));
                console.log("/sensor/deviceid sensor provisoned ; ");


            }
            catch (error) {
                res.status(500);
                res.send("something went wrong")
                console.error("\n error when provisoning sensor : \n", error)
            }
            finally {
                client.close();
            }


        }
        processProvisonSensor();

    }).delete((req, res, next) => {
        const processUnprovisonSensorRequest = async () => {
            try {
                await client.connect();
                const result = await client.db("Users").collection("ProvisionedSensors").deleteOne({
                    deviceId: req.params.deviceId,
                    sensorId: req.body.sensorId
                });

                res.status(200);
                res.send(JSON.stringify({
                    log: result,
                }));
                console.log("/sensor/deviceid sensor deleted; ");

            } catch (error) {
                console.error("\n error occured wheen deleting a sensor \n", error);
            }
            finally {
                client.close();
            }
        }
        processUnprovisonSensorRequest();
    });


export default sensorRouter;


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