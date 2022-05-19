const http = require('http');
const express = require('express');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
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
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: false
    },
    store: store,
    resave: false,
    saveUninitialized: true
}));

app.get('/session', function(req, res) {
    res.send('Hello ' + JSON.stringify(req.session));
});

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