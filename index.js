const connectToMongo = require("./db");
const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
dotenv.config({path:'backend/.env'})
connectToMongo();
const app = express()

app.use(cors())
app.use(bodyParser.json({limit:'50mb'}));
  app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/form',require('./routes/form'));

app.listen(process.env.PORT, () => {
    console.log(`Registration Form backend listening on port ${process.env.PORT}`)
  })