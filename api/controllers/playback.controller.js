const axios = require('axios');
const refresh = require('../controllers/auth.controller').refresh;

exports.play = async(req, res) => {
    refresh(req);
    var url = 'https://api.spotify.com/v1/me/player/play?device_id=' + req.query.device_id;
    await axios.put(url, {
        "uris": [req.query.uri]
    }, {
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
        })
    });
}

exports.pause = async(req, res) => {
    refresh(req);
    var url = 'https://api.spotify.com/v1/me/player/pause?device_id=' + req.query.device_id;
    await axios.put(url, {}, {
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
        })
    });
}