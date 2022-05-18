var express = require('express');
const path = require('path');
const apiRouter = require('express').Router();
const axios = require('axios');
const JsonSearch = require('search-array').default

apiRouter.get('/', function (req, res, next) {
    res.send("Welcome to our APi")
})

apiRouter.post('/search/playlists', async function (req, res, next) {
    var items = [];
    var count = 0;
    var max = 0;
    var active = true;
    var url = 'https://api.spotify.com/v1/me/playlists?limit=50';
    do {
        await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + req.body.token
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
    let results = searcher.query(req.body.search)

    res.json(results);
})

apiRouter.post('/playlists', async function (req, res, next) {
    var items = [];
    var count = 0;
    var max = 0;
    var active = true;
    var url = 'https://api.spotify.com/v1/me/playlists?limit=50';
    do {
        await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + req.body.token
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

    res.json(items);
})

apiRouter.post('/playlist', async function (req, res, next) {
    var items = [];
    var count = 0;
    var max = 0;
    var active = true;
    var url = 'https://api.spotify.com/v1/me/playlist/' + req.body.id;

    await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + req.body.token
        }
    }).then(function (response) {
       res.json(response.data)
    });
})

module.exports = apiRouter;