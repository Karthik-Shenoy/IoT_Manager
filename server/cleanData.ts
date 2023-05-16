import { MongoClient } from "mongodb";

const uri = "mongodb+srv://karthik:hello123@sensorflow.lirh05g.mongodb.net";
const client = new MongoClient(uri);

function reformatDate(date: string) {
    return date.slice(0, 4) + date.slice(7) + "/" + date.slice(4, 6);
}

client.connect().then(() => {
    let sensorsCursor = client.db("Users").collection("SensorData").find();
    sensorsCursor.toArray().then(async (result)=>{
        console.log(result);
        for (let obj of result) {
            await client.db("Users").collection("SensorData").updateOne({ "_id": obj._id }, { $set: { "date": reformatDate(obj.date) } });
        }
        console.log("done with the updates");
        client.close();
    });
    
    
    
})