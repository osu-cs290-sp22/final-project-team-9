const apiRouter = require('express').Router();
const OpenApiValidator = require('express-openapi-validator');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const auth = require('./auth');
const playlists = require('./playlists');

const apiSpec = path.join(__dirname, 'api.yaml');

apiRouter.use(cookieParser()); // Need cookie parser for cookie auth
apiRouter.use('/spec', express.static(apiSpec));
apiRouter.use('/auth', auth.router);
apiRouter.use('/playlists', playlists.router);

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

apiRouter.get('/', function(req, res, next) {
    auth.refresh(req);
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

module.exports = {
    router: apiRouter,
};