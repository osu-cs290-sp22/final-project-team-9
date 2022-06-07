var express = require('express');
const path = require('path');
const router = require('express').Router();
const api = require('../api');

router.use('/api', api.router);
router.use('/assets', express.static(path.join(__dirname, '../dist/'))); // Serve "/dist" from "/assets"
router.use('/assets', express.static(path.join(__dirname, '../test_data/'))); // Serve "/test_data" from "/assets"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/'))); // Serve "/node_modules/bootstrap/disk" from "/assets"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/handlebars/dist/'))); // Serve "/node_modules/handlebars/dist" from "/assets"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/@cdgco/brand-buttons/dist/'))); // Serve "/node_modules/@cdgco/brand-buttons/dist" from "/assets"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/bootstrap-select/dist/'))); // Serve "/node_modules/bootstrap-select/dist" from "/assets"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/jquery/dist/'))); // Serve "/node_modules/jquery/dist" from "/assets"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/echarts/dist'))); // Serve "/node_modules/echarts/dist" from "/assets"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/echarts-gl/dist'))); // Serve "/node_modules/echarts-gl/dist" from "/assets"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/font-awesome/'))); // Serve "/node_modules/font-awesome" from "/assets"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/animate.css/'))); // Serve "/node_modules/animate.css" from "/assets"
router.use('/assets', express.static(path.join(__dirname, '../node_modules/pjax/'))); // Serve "/node_modules/pjax" from "/assets"

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

router.get(['/demo', '/demo.html'], (req, res, next) => {
    res.render('demo');
});

router.get(['/about', '/about.html'], function(req, res, next) {
    res.render('about', {
        layout: 'blank'
    });
})

router.get(['/playback', '/playback.html'], function(req, res, next) {
    res.render('playback', {
        layout: 'blank'
    });
})

router.get(['/learn', '/learn.html'], function(req, res, next) {
    res.render('learn', {
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

router.get('/share/:id', function(req, res, next) {
    res.render('share', {
        layout: 'blank'
    });
});

router.get(['/overview', '/overview.html'], function(req, res, next) {
    if (req.session.token === undefined || req.session.token === null) {
        res.redirect('/');
        return;
    }

    res.render('overview', {
        navState: 2,
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