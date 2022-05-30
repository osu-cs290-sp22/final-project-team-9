const playlistRouter = require('express').Router();
const playlists = require("../controllers/playlists.controller");

playlistRouter.get('/search', playlists.search);
playlistRouter.get('/:id', playlists.getPlaylist);
playlistRouter.get('/:id/metadata', playlists.getPlaylistMetadata);
playlistRouter.get('/', playlists.getPlaylists);

module.exports = playlistRouter;