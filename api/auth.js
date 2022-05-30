const authRouter = require('express').Router();
const axios = require('axios');
const qs = require('qs');

const BASE_ACC_URL = "https://accounts.spotify.com";
const AUTH_URL = BASE_ACC_URL + "/authorize";
const AUTH_TOKEN_URL = BASE_ACC_URL + "/api/token"

const refresh = async(req, success = null, fail = null) => {
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
        if (fail !== null && typeof fail === 'function') {
            req.session.token = null;
            req.session.save()
            if (fail !== null && typeof fail === 'function') {
                fail();
            }
        }
    }
}

authRouter.get('/session', function(req, res) {
    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [],
        "result": req.session
    });
});

authRouter.get('/refresh', async function(req, res, next) {
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

authRouter.get('/callback', async function(req, res, next) {
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
});

authRouter.get('/login', function(req, res, next) {
    const config = qs.stringify({
        'client_id': process.env.CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': process.env.CALLBACK_URL,
        'scope': 'user-top-read playlist-read-private playlist-read-collaborative',
        "show_dialog": false
    });

    res.redirect(`${AUTH_URL}?${config}`);
})

authRouter.get('/logout', function(req, res, next) {
    req.session.token = null;
    req.session.save()
    res.redirect("/")
})

module.exports = {
    router: authRouter,
    refresh: refresh
};
