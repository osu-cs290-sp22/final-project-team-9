var express = require('express');
const path = require('path');
const router = require('express').Router();
const pkceChallenge = require("pkce-challenge").default;
const challenge = pkceChallenge();

const spotifyReq = require('../spotifyrequest.js');

router.use(express.static(path.join(__dirname, '../public'))); // Serve static files from "public"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/@cdgco/brand-buttons/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/jquery/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/font-awesome/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../public/'))); // Serve "/assets" from "node_modules/bootstrap"

router.get('/about', function(req, res, next) {
    res.redirect('/about.html');
})

router.get('/auth', function(req, res, next) {
    let spotifyLoginURL = spotifyReq.GetAuthURL(challenge.code_challenge);
    res.redirect(spotifyLoginURL);
})

router.get('/logout', function(req, res, next) {
    if (req.cookies.spToken !== undefined) {
        res.clearCookie("spToken");
    }
    res.redirect("/")
})

router.get('/callback', async function(req, res, next) {
    const callbackCode = req.query.code;
    const state = req.query.state;
    var token = await spotifyReq.GetOAuthToken(callbackCode, challenge.code_verifier);
    if (req.cookies.spToken === undefined) {
        res.cookie('spToken', JSON.stringify(token), { maxAge: 900000, httpOnly: false });
    }
    console.log(token)
    res.redirect("/start.html")
})

router.post('/start.html', function (req, res, next) {
    if (req.body.search) {
        console.log(" PLAYLIST POST = " + req.body.search);
    }
})

module.exports = router;