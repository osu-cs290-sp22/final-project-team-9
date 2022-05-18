const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
var app = express();
require('dotenv').config();
const pkceChallenge = require("pkce-challenge").default;
const challenge = pkceChallenge();
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

const spotifyReq = require('./spotifyrequest.js');

app.use(express.static(path.join(__dirname, '/public'))); // Serve static files from "public"
app.use('/assets', express.static(__dirname + '/node_modules/bootstrap/dist/')); // Serve "/assets" from "node_modules/bootstrap"
app.use('/assets', express.static(__dirname + '/node_modules/@cdgco/brand-buttons/dist/')); // Serve "/assets" from "node_modules/bootstrap"
app.use('/assets', express.static(__dirname + '/node_modules/font-awesome/')); // Serve "/assets" from "node_modules/bootstrap"
app.use('/assets', express.static(__dirname + '/public/')); // Serve "/assets" from "node_modules/bootstrap"

app.get('/about', function(req, res, next) {
    res.redirect('/about.html');
})

app.get('/auth', function(req, res, next) {
    let spotifyLoginURL = spotifyReq.GetAuthURL(challenge.code_challenge);
    res.redirect(spotifyLoginURL);
})

app.get('/logout', function(req, res, next) {
    if (req.cookies.spToken !== undefined) {
        res.clearCookie("spToken");
    }
    res.redirect("/")
})

app.get('/callback', async function(req, res, next) {
    const callbackCode = req.query.code;
    const state = req.query.state;
    var token = await spotifyReq.GetOAuthToken(callbackCode, challenge.code_verifier);
    if (req.cookies.spToken === undefined) {
        res.cookie('spToken', JSON.stringify(token), { maxAge: 900000, httpOnly: false });
    }
    res.redirect("/start.html")
})

app.post('/start.html', function (req, res, next) {
    if (req.body.search) {
        console.log(" PLAYLIST POST = " + req.body.search);
    }
})


http.createServer(app).listen((process.env.PORT || 8000), () => {
    console.log("HTTP Server running on port " + (process.env.PORT || 8000));
});