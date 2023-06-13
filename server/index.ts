import express from 'express';
import iothub from 'azure-iothub';
import SignUpRouter from './routes/SignUpRouter';
import SignInRouter from './routes/SignInRouter';
import EdgeDeviceRouter from './routes/EdgeDeviceRouter';
import sensorRouter from './routes/SensorRouter';
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
app.use("/edgeDevices", EdgeDeviceRouter);
app.use("/sensors", sensorRouter);

app.get('/', (req, res) => {
    res.status(200);
    console.log(req);
    res.end("TypeScript With Express");

});

const wsServer = new webSocket.Server({ noServer: true });
const getWatcher = async () => {
    try {
        client = await client.connect();
        const changeStream = client.db("Users").collection("SensorData").watch();
        console.log("Database Watcher Connected Connected")
        return changeStream;
    } catch (error) {
        console.log("error when establishing change listener");
    }
}
getWatcher().then((changeStream: any) => {
    if (changeStream) {
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
    }
});


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

