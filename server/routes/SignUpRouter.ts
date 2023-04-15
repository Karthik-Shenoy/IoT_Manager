import { Router, json } from 'express';
import fs from "fs";
import path from "path";
import { MongoClient, ObjectId, Timestamp } from 'mongodb';
import crypto from 'crypto';

const generateUID = () => {
    const UID = "User_" + Date.now().toString(16);
    return UID;
}

// Create an express app and use JSON middleware
const SignUpRouter = Router();
SignUpRouter.use(json());


// we will mount this router at /resources end point, any requests coming in will goto /resources/
SignUpRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get(async (req, res, next) => {
        res.status(403);
        res.end("Method Not Supported");
    })
    .post((req, res, next) => {
        //karthik, JXwzckviqcEMehn0

        const uri = "mongodb+srv://karthik:hello123@sensorflow.lirh05g.mongodb.net";
        const client = new MongoClient(uri);

        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            UID: generateUID()
        }
        client.connect().then(async () => {
            const existingUser = await client.db("Users").collection("UserData").findOne({email: newUser.email});
            if(!existingUser){
                await client.db("Users").collection("UserData").insertOne(newUser);
                console.log("success")
            }
            else{
                res.status(400);
                res.end(JSON.stringify({UID: 10}));
            }
            client.close();
        });
        res.status(200);
        res.end(JSON.stringify({ UID: newUser.UID }));
    })
    .put((req, res, next) => {
        res.status(403);
        res.end("PUT operation not supported on /resources ")
    })
    .delete((req, res, next) => {
        res.status(403);
        res.end("Delete operation not supported on /resources ")
    });



export default SignUpRouter;


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