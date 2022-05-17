const http = require('http');
const express = require('express');
const path = require('path');
var app = express();
require('dotenv').config();

const spotifyReq = require('./spotifyrequest.js');

app.use(express.static(path.join(__dirname, '/public'))); // Serve static files from "public"
app.use('/assets', express.static(__dirname + '/node_modules/bootstrap/dist/')); // Serve "/assets" from "node_modules/bootstrap"

app.get('/auth', function(req, res, next) {
    let spotifyLoginURL = spotifyReq.GetAuthURL();
    res.redirect(spotifyLoginURL);
})

app.get('/callback', async function(req, res, next) {
    const callbackCode = req.query.code;
    console.log("code is " + callbackCode);
    var token = await spotifyReq.GetOAuthToken(callbackCode);

    res.redirect("/")
})

http.createServer(app).listen((process.env.PORT || 8000), () => {
    console.log("HTTP Server running on port " + (process.env.PORT || 8000));
});