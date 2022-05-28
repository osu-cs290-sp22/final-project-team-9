var express = require('express');
const path = require('path');
const fs = require('fs');
const router = require('express').Router();
const api = require('../api');

const TEST_GLOBAL_PLAYLISTS = JSON.parse(fs.readFileSync('./test_data/global-playlists.json'));
const TEST_FEATURED_PLAYLISTS = JSON.parse(fs.readFileSync('./test_data/featured-playlists.json'));
const TEST_CARTERS_PLAYLISTS = JSON.parse(fs.readFileSync('./test_data/carters-playlists.json'));
const TEST_USER_PLAYLISTS = JSON.parse(fs.readFileSync('./test_data/user-playlists.json'));

router.use('/api', api.router);
router.use('/assets', express.static(path.join(__dirname, '../dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/handlebars/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/@cdgco/brand-buttons/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/jquery/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/font-awesome/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/animate.css/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/pjax/'))); // Serve "/assets" from "node_modules/bootstrap"

router.get(['/', '/index.html'], (req, res, next) => {
    if (req.session.token !== undefined && req.session.token !== null) {
        res.redirect('/start');
        return;
    }

    res.render('index', {
        playlists: TEST_GLOBAL_PLAYLISTS.result.playlists,
        navState: 1
    });
});

router.get(['/start', '/start.html'], (req, res, next) => {
    if (req.session.token === undefined || req.session.token === null) {
        res.redirect('/');
        return;
    }

    res.render('start', {
        navState: 2
    });
});

router.get(['/next', '/next.html'], (req, res, next) => {
    if (req.session.token === undefined || req.session.token === null) {
        res.redirect('/');
        return;
    }

    res.render('next', {
        navState: 2
    });
});

router.get(['/about', '/about.html'], function(req, res, next) {
    res.render('about', {
        layout: 'blank'
    });
})

router.get(['/license', '/license.html'], function(req, res, next) {
    res.render('license', {
        layout: 'blank'
    });
})

router.post(['/start', '/start.html'], function(req, res, next) {
    if (req.body.search) {
        console.log(" PLAYLIST POST = " + req.body.search);
    }
    res.json({
        success: true,
        data: req.body.search
    })
})

module.exports = router;