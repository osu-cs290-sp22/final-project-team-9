const axios = require('axios');
const qs = require('qs');

const BASE_ACC_URL = "https://accounts.spotify.com";
const AUTH_URL = BASE_ACC_URL + "/authorize";
const AUTH_TOKEN_URL = BASE_ACC_URL + "/api/token"

exports.refresh = async(req, success = null, fail = null) => {
    if (req.session.token !== undefined && req.session.token !== null && req.session.token.refresh_token !== undefined) {
        const token = req.session.token.refresh_token;
        const config = qs.stringify({
            "grant_type": 'refresh_token',
            "refresh_token": token,
            "client_id": process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
        });

        var newToken = await axios.post(AUTH_TOKEN_URL, config);
        if (newToken.data !== undefined && newToken.data.access_token !== undefined) {
            req.session.token = newToken.data;
            req.session.token.refresh_token = token;
            req.session.touch()
            req.session.save()
            if (success !== null && typeof success === 'function') {
                success();
            }
        } else {
            req.session.token = null;
            req.session.save()
            if (fail !== null && typeof fail === 'function') {
                fail();
            }
        }
    } else {
        req.session.token = null;
        req.session.save()
        if (fail !== null && typeof fail === 'function') {
            fail();
        }
    }
}

exports.getSession = (req, res) => {
    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [],
        "result": req.session
    });
}

exports.refreshToken = async(req, res) => {
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
}

exports.handleCallback = async(req, res) => {
    const config = qs.stringify({
        "grant_type": 'authorization_code',
        "code": req.query.code,
        "redirect_uri": process.env.CALLBACK_URL,
        "client_id": process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
    });

    var token = await axios.post(AUTH_TOKEN_URL, config);

    if (token.data !== undefined && token.data.access_token !== undefined) {
        req.session.token = token.data;
        req.session.touch()
        req.session.save()
    }

    res.redirect("/start");
}

exports.login = async(req, res) => {
    const config = qs.stringify({
        'client_id': process.env.CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': process.env.CALLBACK_URL,
        'scope': 'user-top-read playlist-read-private playlist-read-collaborative',
        "show_dialog": false
    });

    res.redirect(`${AUTH_URL}?${config}`);
}

exports.logout = (req, res) => {
    req.session.token = null;
    req.session.save()
    res.redirect("/")
}