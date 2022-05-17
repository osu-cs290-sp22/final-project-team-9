const http = require('http');
const express = require('express');
const path = require('path');
var app = express();
require('dotenv').config();

const spotifyReq = require('./spotifyrequest.js');
const AUTH_TOKEN = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf-8').toString('base64');

app.use(express.static(path.join(__dirname, '/public'))); // Serve static files from "public"
app.use('/assets', express.static(__dirname + '/node_modules/bootstrap/dist/')); // Serve "/assets" from "node_modules/bootstrap"

app.get('/auth', function(req, res, next) {
    let spotifyLoginURL = spotifyReq.GetAuthURL(process.env.CLIENT_ID, process.env.CALLBACK_URL);
    res.writeHead(307, { 'Location': spotifyLoginURL });
})

app.get('/callback', function(req, res, next) {
    payload = {
        "grant_type": "authorization_code",
        "code": params.get('code'),
        "redirect_uri": process.env.CALLBACK_URL,
        "client_id": process.env.CLIENT_ID,
        "client_secret": process.env.CLIENT_SECRET
    };
    var token = spotifyReq.GetOAuthToken(payload);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.redirect("/")
})

http.createServer(app).listen((process.env.PORT || 8000), () => {
    console.log("HTTP Server running on port " + (process.env.PORT || 8000));
});