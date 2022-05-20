const apiRouter = require('express').Router();
const axios = require('axios');
const OpenApiValidator = require('express-openapi-validator');
const JsonSearch = require('search-array').default
const path = require('path');
const express = require('express');
const apiSpec = path.join(__dirname, 'api.yaml');
const cookieParser = require('cookie-parser');
const spotifyReq = require('../spotifyrequest.js');

apiRouter.use(cookieParser()); // Need cookie parser for cookie auth
apiRouter.use('/spec', express.static(apiSpec));

async function refresh(req, success = null, fail = null) {
    const token = req.session.token.refresh_token;
    var newToken = await spotifyReq.RefreshToken(token);
    newToken.refresh_token = token;
    if (newToken.access_token !== undefined) {
        req.session.token = newToken;
        req.session.touch()
        req.session.save()
        if (success !== null && typeof success === 'function') {
            success();
        }
    }
    else {
        if (fail !== null && typeof fail === 'function') {
            fail();
        }
    }
}

apiRouter.use(
    OpenApiValidator.middleware({
        apiSpec,
        validateRequests: true,
        validateResponses: true,
        validateSecurity: {
            handlers: {
                CookieAuth: (req, scopes, schema) => { // require cookie with token
                    if (req.session.token === undefined || req.session.token === null) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
    })
);

apiRouter.use((err, req, res, next) => { // default error handler
    res.json({
        "success": false,
        "code": (err.status || 500),
        "errors": err.errors,
        "messages": [err.message],
        "result": null
    });
});

apiRouter.get('/', function (req, res, next) {
    refresh(req);
    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [
            "hooray! welcome to our api!"
        ],
        "result": null
    });
})

apiRouter.get('/auth/session', function(req, res) {
    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [],
        "result": req.session
    });
});

apiRouter.get('/auth/refresh', async function(req, res, next) {
    refresh(req, () => {
        res.json({
            "success": true,
            "code": 200,
            "errors": [],
            "messages": [],
            "result": null
        });
    }, () => {
        res.json({
            "success": false,
            "code": 500,
            "errors": [],
            "messages": [],
            "result": null
        });
    });
})

apiRouter.get('/playlists', async function (req, res, next) {
    refresh(req);
    var items = [];
    var count = 0;
    var max = 0;
    var url = 'https://api.spotify.com/v1/me/playlists?limit=50';
    do {
        await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + req.session.token.access_token
            }
        }).then(function (response) {
            response.data.items.forEach(element => {
                items.push(element);
            });
            count += 50;
            max = response.data.total;
            url = response.data.next;
        });
    } while (count <= max);

    var names = ["Daily Mix 1", "Daily Mix 2", "Daily Mix 3", "Daily Mix 4", "Daily Mix 5", "Daily Mix 6", "Daily Wellness", "Release Radar", "Discover Weekly", "Your Top Songs 2021", "Your Top Songs 2020", "Your Top Songs 2019", "Your Top Songs 2018", "Your Top Songs 2017", "Your Top Songs 2016"]

    if (req.query.option == 2) {
        items = items.filter(function(itm){
            return names.indexOf(itm.name) == -1;
        });
    }
    else if (req.query.option == 3) {
        items = items.filter(function(itm){
            return names.indexOf(itm.name) > -1;
        });
    }
    else if (req.query.option == 4) {
        var madeforyou = items.filter(function(itm){
            return names.indexOf(itm.name) > -1;
        });
        items = items.filter(function(itm){
            return names.indexOf(itm.name) == -1;
        });
        items = madeforyou.concat(items);
    }
    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [],
        "result": {
            "playlists": items,
            "count": items.length
        }
    });
})


apiRouter.get('/playlists/featured', async function (req, res, next) {
    refresh(req);
    var items = [];
    var count = 0;
    var max = 0;
    var url = 'https://api.spotify.com/v1/browse/featured-playlists';
    do {
        await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + req.session.token.access_token
            }
        }).then(function (response) {
            response.data.playlists.items.forEach(element => {
                items.push(element);
            });
            count += 50;
            max = response.data.total;
            url = response.data.next;
        });
    } while (count <= max);
    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [],
        "result": {
            "playlists": items,
            "count": items.length
        }
    });
})

apiRouter.get('/playlists/search', async function (req, res, next) {
    refresh(req);
    var items = [];
    var count = 0;
    var max = 0;
    if (req.query.public !== true) {
        var url = 'https://api.spotify.com/v1/me/playlists?limit=50';
        do {
            await axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + req.session.token.access_token
                }
            }).then(function (response) {
                response.data.items.forEach(element => {
                    items.push(element);
                });
                count += 50;
                max = response.data.total;
                url = response.data.next;
            });
        } while (count <= max);
        const searcher = new JsonSearch(items)
        let results = searcher.query(req.query.query)
        res.json({
            "success": true,
            "code": 200,
            "errors": [],
            "messages": [],
            "result": {
                "playlists": results,
                "count": results.length
            }
        });
    }
    else {
        var url = 'https://api.spotify.com/v1/search?limit=50&type=playlist&q=' + req.query.query;
        await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + req.session.token.access_token
            }
        }).then(function (response) {
            res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": {
                    "playlists": response.data.playlists.items,
                    "count": response.data.playlists.items.length
                }
            });
        });
    }
})

apiRouter.get('/playlists/:id', async function (req, res, next) {
    refresh(req);
    var url = 'https://api.spotify.com/v1/playlists/' + req.params.id;
    await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + req.session.token.access_token
        }
    }).then(function (response) {
        res.json({
            "success": true,
            "code": 200,
            "errors": [],
            "messages": [],
            "result": response.data
        });
    });
})

apiRouter.get('/playlists/:id/metadata', async function (req, res, next) {
    refresh(req);
    var url = 'https://api.spotify.com/v1/playlists/' + req.params.id;
    await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + req.session.token.access_token
        }
    }).then(async function (response) {
        var total = response.data.tracks.total;
        var tracks = response.data.tracks.items;
        if (total > 100) {
            var count = 100;
            do {
                await axios.get('https://api.spotify.com/v1/playlists/' + req.params.id + '/tracks?offset=' + count + '&limit=100', {
                    headers: {
                        'Authorization': 'Bearer ' + req.session.token.access_token
                    }
                }).then(function (response) {
                    response.data.items.forEach(element => {
                        tracks.push(element);
                    });
                    count += 100;
                });
            } while (count <= total);
        }
        var tracksCopy = tracks.slice();
        var metadata = [];
        do {
            var trackList = "";
            var length = (tracks.length > 100) ? 100 : tracks.length;
            for (var i = 0; i < length; i++) {
                trackList += tracks[i].track.id + ",";
                tracks.splice(i--, 1);
                length--;
            }
            await axios.get('https://api.spotify.com/v1/audio-features/?ids=' + trackList, {
                headers: {
                    'Authorization': 'Bearer ' + req.session.token.access_token
                }
            }).then(function (response) {
                metadata = metadata.concat(response.data.audio_features);
            });
        } while (tracks.length > 0);
        res.json({
            "success": true,
            "code": 200,
            "errors": [],
            "messages": [],
            "result": {
                "tracks": tracksCopy,
                "metadata": metadata,
                "count": total
            }
        });
    });
})

apiRouter.get('/playlists', async function (req, res, next) {
    refresh(req);
    var items = [];
    var count = 0;
    var max = 0;
    var url = 'https://api.spotify.com/v1/me/playlists?limit=50';
    do {
        await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + req.session.token.access_token
            }
        }).then(function (response) {
            response.data.items.forEach(element => {
                items.push(element);
            });
            count += 50;
            max = response.data.total;
            url = response.data.next;
        });
    } while (count <= max);

    var names = ["Daily Mix 1", "Daily Mix 2", "Daily Mix 3", "Daily Mix 4", "Daily Mix 5", "Daily Mix 6", "Daily Wellness", "Release Radar", "Discover Weekly", "Your Top Songs 2021", "Your Top Songs 2020", "Your Top Songs 2019", "Your Top Songs 2018", "Your Top Songs 2017", "Your Top Songs 2016"]

    if (req.query.option == 2) {
        items = items.filter(function(itm){
            return names.indexOf(itm.name) == -1;
        });
    }
    else if (req.query.option == 3) {
        items = items.filter(function(itm){
            return names.indexOf(itm.name) > -1;
        });
    }
    else if (req.query.option == 4) {
        var madeforyou = items.filter(function(itm){
            return names.indexOf(itm.name) > -1;
        });
        items = items.filter(function(itm){
            return names.indexOf(itm.name) == -1;
        });
        items = madeforyou.concat(items);
    }
    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [],
        "result": {
            "playlists": items,
            "count": items.length
        }
    });
})

module.exports = apiRouter;