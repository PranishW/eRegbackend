const connectToMongo = require("./db");
const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
dotenv.config()
connectToMongo();
const app = express()
const port = process.env.PORT
const BASE_URL = process.env.BASE_URL;
app.use(cors())
app.use(bodyParser.json({limit:'50mb'}));
  app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/form',require('./routes/form'));

app.listen(port, () => {
    console.log(`Registration Form backend listening on ${BASE_URL}`)
  })