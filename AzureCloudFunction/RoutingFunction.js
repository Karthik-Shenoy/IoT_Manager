const Client = require('azure-iothub').Client;
const Message = require('azure-iot-common').Message;
const MongoClient = require('mongodb').MongoClient;
module.exports = async function (context, eventGridEvent) {
    if (eventGridEvent.eventType === 'Microsoft.Devices.DeviceTelemetry') {
        // Get the device ID from the event data
        const deviceId = eventGridEvent.data.systemProperties['iothub-connection-device-id'];
        context.log(`Received telemetry message from device ${deviceId}`);
        // data

        let recievedMessageBody = JSON.parse(atob(eventGridEvent.data.body))
        context.log(recievedMessageBody);

        const uri = "mongodb+srv://karthik:hello123@sensorflow.lirh05g.mongodb.net";
        const client = new MongoClient(uri);

        try {
            await client.connect()
            await client.db("Users").collection("SensorData").insertOne(recievedMessageBody);
            context.log("success");
        }
        catch (error) {
            context.log("error : ", error)
        }
        finally {
            client.close();
        }

    }
};

