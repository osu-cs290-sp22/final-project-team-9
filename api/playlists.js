const playlistRouter = require('express').Router();
const axios = require('axios');
const JsonSearch = require('search-array').default
const refresh = require('./auth').refresh;

playlistRouter.get('/featured', async function(req, res, next) {
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
        }).then(function(response) {
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

playlistRouter.get('/search', async function(req, res, next) {
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
            }).then(function(response) {
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
    } else {
        var url = 'https://api.spotify.com/v1/search?limit=50&type=playlist&q=' + req.query.query;
        await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + req.session.token.access_token
            }
        }).then(function(response) {
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

playlistRouter.get('/:id', async function(req, res, next) {
    refresh(req);
    var url = 'https://api.spotify.com/v1/playlists/' + req.params.id;
    await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + req.session.token.access_token
        }
    }).then(function(response) {
        res.json({
            "success": true,
            "code": 200,
            "errors": [],
            "messages": [],
            "result": response.data
        });
    });
})

playlistRouter.get('/:id/metadata', async function(req, res, next) {
    refresh(req);
    var url = 'https://api.spotify.com/v1/playlists/' + req.params.id;
    await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + req.session.token.access_token
        }
    }).then(async function(response) {
        var total = response.data.tracks.total;
        var tracks = response.data.tracks.items;
        if (total > 100) {
            var count = 100;
            do {
                await axios.get('https://api.spotify.com/v1/playlists/' + req.params.id + '/tracks?offset=' + count + '&limit=100', {
                    headers: {
                        'Authorization': 'Bearer ' + req.session.token.access_token
                    }
                }).then(function(response) {
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
            }).then(function(response) {
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

playlistRouter.get('/', async function(req, res, next) {
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
        }).then(function(response) {
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
        items = items.filter(function(itm) {
            return names.indexOf(itm.name) == -1;
        });
    } else if (req.query.option == 3) {
        items = items.filter(function(itm) {
            return names.indexOf(itm.name) > -1;
        });
    } else if (req.query.option == 4) {
        var madeforyou = items.filter(function(itm) {
            return names.indexOf(itm.name) > -1;
        });
        items = items.filter(function(itm) {
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

module.exports = {
    router: playlistRouter,
};