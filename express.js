const http = require('http');
const express = require('express');
const exprhbs = require('express-handlebars');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require("body-parser");
const router = require('./routes');
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
        httpOnly: true
    },
    store: store,
    resave: false,
    saveUninitialized: true,
    name: 'sl_session'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 'hbs' is an abbreviated convention for 'handlebars. Only one or the other can be used, not interchangeable.
app.set('view engine', 'hbs');
app.set('/views', __dirname + '/views');
app.engine('hbs', exprhbs.engine({
    layoutsDir: (__dirname + '/views/layouts'),
    partialsDir: (__dirname + '/views/partials'),
    extname: 'hbs',
    defaultLayout: 'base',
    helpers: require('handlebars-helpers')()
}))

app.use('/', router);

http.createServer(app).listen((process.env.PORT || 8000), () => {
    console.log("HTTP Server running on port " + (process.env.PORT || 8000));
});