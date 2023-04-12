import express from 'express';
import iothub from 'azure-iothub';
import SignUpRouter from './routes/SignUpRouter';
import SignInRouter from './routes/SignInRouter';
import CreateResourceRouter from './routes/CreateResourceRouter';
import sensorRouter from './routes/Sensors';
import webSocket from 'ws';
import http from "http";
import { ChangeStreamDocument, MongoClient } from 'mongodb';


// Initialize the express engine
const app: express.Application = express();
app.use(express.json());

//use mongo client
const uri = "mongodb+srv://karthik:hello123@sensorflow.lirh05g.mongodb.net";
let client = new MongoClient(uri);

// Take a port 3000 for running server.
const port: number = 3001;
const server = http.createServer(app);

// Handling '/' Request
app.use("/signup", SignUpRouter);
app.use("/signin", SignInRouter);
app.use("/createResource", CreateResourceRouter);
app.use("/sensors", sensorRouter);

app.get('/', (req, res) => {
    res.status(200);
    console.log(req);
    res.end("TypeScript With Express");

});

const wsServer = new webSocket.Server({ noServer: true });
const getWatcher = async () => {
    client = await client.connect();
    const changeStream = client.db("Users").collection("SensorData").watch();
    console.log("Database Watcher Connected Connected")
    return changeStream;
}
getWatcher().then((changeStream: any) => {
    wsServer.on('connection', socket => {
        //socket.on('message', message => console.log(message.toString()));
        console.log(wsServer.clients.size)
        console.log("Web Socket Connection Established")
        changeStream.on('change', (change: ChangeStreamDocument) => {
            socket.send(JSON.stringify({ changed: true }));
        })
        if (wsServer.clients.size > 0) {
            for (let client of wsServer.clients) {
                client.onclose = () => {
                    console.log("connection closed");
                }
            }
        }

    });
});








app.post('/', (req, res) => {
    var connectionString = 'HostName=DummyHub77.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=MaZpu9OyelWoRacIGoKSsXHo5GizaVeDuQcDX5BYh4c=';

    var registry = iothub.Registry.fromConnectionString(connectionString);

    // Create a new device
    var device = {
        deviceId: 'sample-device-' + Date.now()
    };

    registry.create(device, function (err, deviceInfo, res) {
        if (err) console.log(' error: ' + err.toString());
        if (res) console.log(' status: ' + res.statusCode + ' ' + res.statusMessage);
        if (deviceInfo) {
            //console.log(' device info: ' + JSON.stringify(deviceInfo));
            const sendData = async () => {
                try {
                    const response = await fetch("http://127.0.0.1:1880/configDevice", {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-type": "application/json; charset=UTF-8"
                        },
                        body: JSON.stringify({
                            deviceId: deviceInfo.deviceId,
                            key: deviceInfo.authentication?.symmetricKey?.primaryKey
                        })
                    })
                    const responseVal = await response.text();
                    console.log(responseVal)
                }
                catch (e) {
                    console.log(e);
                }
            }
            sendData();
        }
    });
    res.end("Device Created name : " + device.deviceId);
})


server.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
})
// Server setup
server.listen(port, () => {
    console.log(`TypeScript with Express
         http://localhost:${port}/`);
});

