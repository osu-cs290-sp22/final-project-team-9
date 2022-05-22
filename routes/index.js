var express = require('express');
const path = require('path');
const router = require('express').Router();
const api = require('../api');

router.use('/api', api.router);

router.get(['/', '/index.html'], (req, res, next) => {
    if (req.session.token !== undefined && req.session.token !== null) {
        res.redirect('/start.html');
        return;
    }

    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get(['/start', '/start.html'], (req, res, next) => {
    if (req.session.token === undefined || req.session.token === null) {
        res.redirect('/');
        return;
    }

    res.sendFile(path.join(__dirname, '../public/start.html'));
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