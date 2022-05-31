const db = require("../models");
const axios = require('axios');
const FeaturedPlaylists = db.featuredPlaylists;
const Playlists = db.playlists;
const refresh = require('./auth.controller').refresh;

exports.retrieveLatest = (req, res) => {
    FeaturedPlaylists.findOne({}, {}, { sort: { 'updatedAt': -1 } }, function(err, playlists) {
        if (err) {
            return res.json({
                "success": false,
                "code": 500,
                "errors": [err],
                "messages": [err],
                "result": null
            });
        }

        if (!playlists) {
            return res.json({
                "success": false,
                "code": 404,
                "errors": ["No results found"],
                "messages": [err],
                "result": null
            });
        }

        return res.json({
            "success": true,
            "code": 200,
            "errors": [],
            "messages": [],
            "result": playlists
        });
    });
};

exports.updateCache = async(req, res) => {
    refresh(req);
    var items = [];
    var count = 0;
    var max = 0;
    var url = 'https://api.spotify.com/v1/browse/featured-playlists';
    FeaturedPlaylists.findOne({}, {}, { sort: { 'created_at': -1 } }, async function(err, playlists) {
        var update = false;
        if (err || !playlists || (new Date(playlists.updatedAt).getTime() + (1000 * 60 * 60 * 24) < new Date().getTime())) {
            update = true;
        }
        if (update) {
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
            var extras = ["37i9dQZEVXbLRQDuF5jeBp", "37i9dQZEVXbMDoHDwVN2tF", "37i9dQZF1DXcBWIGoYBM5M", "37i9dQZF1DX4JAvHpjipBk"];
            for (var i = 0; i < extras.length; i++) {
                if (!items.find(x => x.id === extras[i])) {
                    await axios.get('https://api.spotify.com/v1/playlists/' + extras[i], {
                        headers: {
                            'Authorization': 'Bearer ' + req.session.token.access_token
                        }
                    }).then(function(response) {
                        items.push(response.data);
                    });
                }

                if (i === extras.length - 1) {
                    FeaturedPlaylists.create({ playlists: items }, function(err, playlists) {
                        if (err) {
                            return res.json({
                                "success": false,
                                "code": 500,
                                "errors": [err],
                                "messages": [err],
                                "result": null
                            });
                        } else {
                            var itemsProcessed = 0;
                            var errCount = 0;
                            items.forEach(async(element) => {
                                itemsProcessed++;
                                Playlists.findOne({ snapshot_id: element.snapshot_id }, async function(err, playlist) {
                                    if (err || !playlist) {
                                        url = 'https://api.spotify.com/v1/playlists/' + element.id;
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
                                                    await axios.get('https://api.spotify.com/v1/playlists/' + element.id + '/tracks?offset=' + count + '&limit=100', {
                                                        headers: {
                                                            'Authorization': 'Bearer ' + req.session.token.access_token
                                                        }
                                                    }).then(function(response) {
                                                        response.data.items.forEach(element1 => {
                                                            tracks.push(element1);
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

                                            element.trackList = tracksCopy;
                                            element.trackMetadata = metadata;
                                            Playlists.findOneAndUpdate({ id: element.id }, element, { new: true, upsert: true, rawResult: true }, function(err, playlist) {
                                                if (err) errCount++;
                                            });
                                        });
                                    }
                                });
                                if (itemsProcessed === items.length) {
                                    if (errCount > 0) {
                                        return res.json({
                                            "success": false,
                                            "code": 500,
                                            "errors": [],
                                            "messages": [],
                                            "result": null
                                        });
                                    } else {
                                        return res.json({
                                            "success": true,
                                            "code": 200,
                                            "errors": [],
                                            "messages": [],
                                            "result": update
                                        });
                                    }
                                }
                            })
                        }
                    })
                }
            }
        } else {
            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": update
            });
        }
    });
};