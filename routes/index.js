var express = require('express');
const path = require('path');
const router = require('express').Router();
const api = require('../api');

router.use('/api', api.router);
router.use('/assets', express.static(path.join(__dirname, '../dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../test_data/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/handlebars/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/@cdgco/brand-buttons/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/bootstrap-select/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/jquery/dist/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/echarts/dist'))); // Serve "/assets" from "node_modules/echarts"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/font-awesome/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/animate.css/'))); // Serve "/assets" from "node_modules/bootstrap"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/pjax/'))); // Serve "/assets" from "node_modules/bootstrap"

router.get(['/', '/index.html'], (req, res, next) => {
    if (req.session.token !== undefined && req.session.token !== null) {
        res.redirect('/start');
        return;
    }

    res.render('index', {
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

router.get('/bargraphdemo', function(req, res, next) {
    res.render('bargraphdemo', {
        layout: 'blank'
    });
})

router.get('/linegraphdemo', function(req, res, next) {
    res.render('linegraphdemo', {
        layout: 'blank'
    });
})

router.get('/piechartdemo', function(req, res, next) {
    res.render('piechartdemo', {
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