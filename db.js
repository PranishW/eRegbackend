const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()
// "mongodb://localhost:27017/eRegistration"
const MongoURI = process.env.MONGO_URI
const connectToMongo = () =>{
    mongoose.connect(MongoURI,()=>{
        console.log("Connected to Mongoose")
        console.log(process.env)
    });
}
module.exports= connectToMongo;