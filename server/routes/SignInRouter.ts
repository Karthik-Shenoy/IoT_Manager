import { Router, json } from 'express';
import fs from "fs";
import path from "path";
import { MongoClient, ObjectId, Timestamp } from 'mongodb';
import crypto from 'crypto';

const generateUID = () => {
    const UID = "User_" + Date.now().toString(16);
    return UID;
}

const uri = "mongodb+srv://karthik:hello123@sensorflow.lirh05g.mongodb.net";
console.log(1);
const client = new MongoClient(uri);

// Create an express app and use JSON middleware
const SignInRouter = Router();
SignInRouter.use(json());


// we will mount this router at /resources end point, any requests coming in will goto /resources/
SignInRouter.route('/')
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
        let newUser = {
            email: req.body.email,
            password: req.body.password,
        }
        const authenticateUser = async () => {
            try {
                await client.connect();
                const existingUser = await client.db("Users").collection("UserData").findOne({ email: newUser.email });
                if (!existingUser) {
                    res.status(400);
                    res.end(JSON.stringify({ UID: 20 }));
                } else if (newUser.password != existingUser.password) {
                    res.status(400)
                    res.end(JSON.stringify({ UID: 21 }))
                }
                else {
                    res.status(200);
                    res.end(JSON.stringify({ UID: existingUser.UID }));
                }
            } catch (error) {
                console.error("error when authenticating the user");
            } finally {
                await client.close();
            }
        }
        authenticateUser();
    })
    .put((req, res, next) => {
        res.status(403);
        res.end("PUT operation not supported on /resources ")
    })
    .delete((req, res, next) => {
        res.status(403);
        res.end("Delete operation not supported on /resources ")
    });

SignInRouter.route('/:userUID')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get(async (req, res, next) => {
        console.log(1);
        try {
            await client.connect();
            let retrievedUserDoc = await client.db("Users").collection("UserData").findOne({ UID: req.params.userUID });
            if (retrievedUserDoc) {
                res.end(JSON.stringify({
                    name: retrievedUserDoc.name,
                    emailId: retrievedUserDoc.email,
                    found: true
                }));
            }
            else {
                res.end(JSON.stringify({
                    name: "",
                    emailId: "",
                    found: false
                }))
            }
        } catch (error) {
            console.log("Error at User log in")
        }
    })


export default SignInRouter;


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