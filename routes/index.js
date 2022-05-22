var express = require('express');
const path = require('path');
const router = require('express').Router();
const spotifyReq = require('../spotifyrequest.js');

router.get('/', (req, res, next) => {
    if (req.session.token !== undefined && req.session.token !== null) {
        res.redirect('/start.html');
    } else {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    }
});
router.get('/index.html', (req, res, next) => {
    if (req.session.token !== undefined && req.session.token !== null) {
        res.redirect('/start.html');
    } else {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    }
});
router.get('/start.html', (req, res, next) => {
    if (req.session.token === undefined || req.session.token === null) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, '../public/start.html'));
    }
});

router.use(express.static(path.join(__dirname, '../public'))); // Serve static files from "public"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/@cdgco/brand-buttons/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/jquery/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/font-awesome/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../public/'))); // Serve "/assets" from "node_modules/bootstrap"

router.get('/about', function(req, res, next) {
    res.redirect('/about.html');
})

router.get('/test', function(req, res, next) {
    res.render('test', {
        layout: 'base'
    });
});

router.get('/auth', function(req, res, next) {
    let spotifyLoginURL = spotifyReq.GetAuthURL();
    res.redirect(spotifyLoginURL);
})

router.get('/logout', function(req, res, next) {
    req.session.token = null;
    req.session.save()
    res.redirect("/")
})

router.get('/callback', async function(req, res, next) {
    const callbackCode = req.query.code;
    var token = await spotifyReq.GetOAuthToken(callbackCode);
    if (token.access_token !== undefined) {
        req.session.token = token;
        req.session.touch()
        req.session.save()
    }
    res.redirect("/start.html");
});

router.post('/start.html', function(req, res, next) {
    if (req.body.search) {
        console.log(" PLAYLIST POST = " + req.body.search);
    }
})

module.exports = router;