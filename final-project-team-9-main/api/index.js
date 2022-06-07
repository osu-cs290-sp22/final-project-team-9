const apiRouter = require('express').Router();
const OpenApiValidator = require('express-openapi-validator');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const playlistRouter = require('./routes/playlists');
const featuredPlaylistsRouter = require('./routes/featuredPlaylists');
const playbackRouter = require('./routes/playback');
const auth = require('./controllers/auth.controller');
const db = require("./models/");

const apiSpec = path.join(__dirname, 'api.yaml');

apiRouter.use(cookieParser()); // Need cookie parser for cookie auth
apiRouter.use('/spec', express.static(apiSpec));

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

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

apiRouter.use('/auth', authRouter);
apiRouter.use('/playlists', playlistRouter);
apiRouter.use('/featuredPlaylists', featuredPlaylistsRouter);
apiRouter.use('/playback', playbackRouter);

module.exports = {
    router: apiRouter,
};