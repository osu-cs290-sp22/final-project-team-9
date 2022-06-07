const playbackRouter = require('express').Router();
const playback = require("../controllers/playback.controller");

playbackRouter.get("/play", playback.play);
playbackRouter.get("/pause", playback.pause);

module.exports = playbackRouter;