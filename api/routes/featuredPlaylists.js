const featuredPlaylistsRouter = require('express').Router();
const featuredPlaylists = require("../controllers/featuredPlaylists.controller");

featuredPlaylistsRouter.get("/", featuredPlaylists.retrieveLatest);
featuredPlaylistsRouter.get("/update", featuredPlaylists.updateCache);

module.exports = featuredPlaylistsRouter;