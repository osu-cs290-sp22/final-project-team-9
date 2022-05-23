var express = require('express');
const path = require('path');
const fs = require('fs');
const router = require('express').Router();
const api = require('../api');

router.use('/api', api.router);

const TEST_GLOBAL_PLAYLISTS = JSON.parse(fs.readFileSync('./test_data/global-playlists.json'));
const TEST_USER_PLAYLISTS = JSON.parse(fs.readFileSync('./test_data/user-playlists.json'));

router.get(['/', '/index.html'], (req, res, next) => {
    if (req.session.token !== undefined && req.session.token !== null) {
        res.render('start', {
            playlists: TEST_USER_PLAYLISTS
        });
        return;
    }

    res.render('index', {
        playlists: TEST_GLOBAL_PLAYLISTS
    });
});

router.get(['/start', '/start.html'], (req, res, next) => {
    if (req.session.token === undefined || req.session.token === null) {
        res.render('index', {
            playlists: TEST_GLOBAL_PLAYLISTS
        });
        return;
    }

    res.render('start', {
        playlists: TEST_USER_PLAYLISTS
    });
});

router.use(express.static(path.join(__dirname, '../public'))); // Serve static files from "public"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/@cdgco/brand-buttons/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/jquery/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/font-awesome/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../public/'))); // Serve "/assets" from "node_modules/bootstrap"

router.get('/about', function(req, res, next) {
    res.render('about', {
        layout: 'blank'
    });
})

router.get('/license', function(req, res, next) {
    res.render('license', {
        layout: 'blank'
    });
})

router.post('/start.html', function(req, res, next) {
    if (req.body.search) {
        console.log(" PLAYLIST POST = " + req.body.search);
    }
})

module.exports = router;