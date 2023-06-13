const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path:'backend/.env'})
// "mongodb://localhost:27017/eRegistration"
const MongoURI = process.env.MONGO_URI
const connectToMongo = () =>{
    mongoose.connect(MongoURI,()=>{
        console.log("Connected to Mongoose")
    });
}
module.exports= connectToMongo;