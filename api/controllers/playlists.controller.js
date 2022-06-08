const axios = require('axios');
const e = require('express');
const JsonSearch = require('search-array').default
const refresh = require('../controllers/auth.controller').refresh;
const db = require("../models");
const Playlists = db.playlists;
const Share = db.share;
const crypto = require('crypto').webcrypto;

async function aesGcmEncrypt(plaintext, SECRET) {
    const pwUtf8 = new TextEncoder().encode(SECRET);
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ivStr = Array.from(iv).map(b => String.fromCharCode(b)).join('');
    const alg = { name: 'AES-GCM', iv: iv };
    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']);
    const ptUint8 = new TextEncoder().encode(plaintext);
    const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8);
    const ctArray = Array.from(new Uint8Array(ctBuffer));
    const ctStr = ctArray.map(byte => String.fromCharCode(byte)).join('');
    return btoa(ivStr + ctStr);
}

async function aesGcmDecrypt(ciphertext, SECRET) {
    const pwUtf8 = new TextEncoder().encode(SECRET);
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);
    const ivStr = atob(ciphertext).slice(0, 12);
    const iv = new Uint8Array(Array.from(ivStr).map(ch => ch.charCodeAt(0)));
    const alg = { name: 'AES-GCM', iv: iv };
    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt']);
    const ctStr = atob(ciphertext).slice(12);
    const ctUint8 = new Uint8Array(Array.from(ctStr).map(ch => ch.charCodeAt(0)));
    try {
        const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8);
        const plaintext = new TextDecoder().decode(plainBuffer);
        return plaintext;
    } catch (e) {
        throw new Error('Decrypt failed');
    }
}

exports.search = async(req, res) => {
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
            }).catch(function(error) {
                console.log(error);
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
        }).catch(function(error) {
            console.log(error);
        });
    }
}

exports.getPlaylist = async(req, res) => {
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
    }).catch(function(error) {
        console.log(error);
    });
}

exports.getPlaylistMetadata = async(req, res) => {
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
            }).catch(function(error) {
                console.log(error);
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
                "count": total,
                "title": response.data.name
            }
        });
    }).catch(function(error) {
        console.log(error);
    });
}

exports.getPlaylists = async(req, res) => {
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
        }).catch(function(error) {
            console.log(error);
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
    items = [...new Set(items)];
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
}

exports.share = async(req, res) => {
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
                }).catch(function(error) {
                    console.log(error);
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
            }).catch(function(error) {
                console.log(error);
            });
        } while (tracks.length > 0);
        var errCount = 0;
        response.data.trackList = tracksCopy;
        response.data.trackMetadata = metadata;

        Playlists.findOne({ snapshot_id: response.data.snapshot_id }, async function(err, playlist) {
            if (err || !playlist) {
                Playlists.findOneAndUpdate({ id: response.data.id }, response.data, { new: true, upsert: true, rawResult: true }, function(err, playlist) {
                    if (err) {
                        errCount++;
                    }
                });
            }
        });
        if (errCount > 0) {
            return res.json({
                "success": false,
                "code": 500,
                "errors": [],
                "messages": [],
                "result": null
            });
        } else {
            Share.create({ playlist: req.params.id, graphType: req.body.graphType, variables: req.body.variables }, function(err, result) {
                if (err) {
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
                        "result": req.headers.origin + "/share/" + result["_id"]
                    });
                }

            });
        }
    }).catch(function(error) {
        console.log(error);
    });
};

exports.retrieveSnapshot = async(req, res) => {
    Share.findOne({ _id: req.params.id }, async function(err, share) {
        if (err || !share) {
            return res.json({
                "success": false,
                "code": 500,
                "errors": [],
                "messages": [],
                "result": null
            });
        } else {
            var playlistId = share.playlist;
            Playlists.findOne({ id: playlistId }, async function(err, playlist) {
                if (err || !playlist) {
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
                        "result": {
                            "graphType": share.graphType,
                            "variables": share.variables,
                            "playlist": playlist
                        }
                    });
                }
            });
        }
    })
};
exports.retrievePublic = async(req, res) => {
    Playlists.findOne({ id: req.params.id }, async function(err, playlist) {
        if (err || !playlist) {
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
                "result": playlist
            });
        }
    });
};

exports.saveGraph = async(req, res) => {
    if (req.session.graphs) {
        req.session.graphs.push({
            "playlist": req.params.id,
            "graphType": req.body.graphType,
            "variables": req.body.variables,
            "image": req.body.image,
            "title": req.body.title,
        });
    } else {
        req.session.graphs = [{
            "playlist": req.params.id,
            "graphType": req.body.graphType,
            "variables": req.body.variables,
            "image": req.body.image,
            "title": req.body.title
        }];
    }
    return res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [],
        "result": null
    });
};

exports.deleteGraph = async(req, res) => {
    if (req.session.graphs && req.session.graphs.length > req.params.id) {
        req.session.graphs.splice(req.params.id, 1);
        req.session.save();
    }
    return res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [],
        "result": null
    });
};