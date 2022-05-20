const http = require('http');
const express = require('express');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require("body-parser");
var app = express();
require('dotenv').config();

var store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

store.on('error', function(error) {
    console.log(error);
});

app.use(require('express-session')({
    secret: process.env.SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 Hour
        httpOnly: false
    },
    store: store,
    resave: false,
    saveUninitialized: true,
    name: 'sl_session'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apiRouter = require('./api');
app.use('/api', apiRouter);

const router = require('./routes');
app.use('/', router);

http.createServer(app).listen((process.env.PORT || 8000), () => {
    console.log("HTTP Server running on port " + (process.env.PORT || 8000));
});