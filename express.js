const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
var app = express();
require('dotenv').config();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apiRouter = require('./api');
app.use('/api', apiRouter);

const router = require('./routes');
app.use('/', router);

http.createServer(app).listen((process.env.PORT || 8000), () => {
    console.log("HTTP Server running on port " + (process.env.PORT || 8000));
});