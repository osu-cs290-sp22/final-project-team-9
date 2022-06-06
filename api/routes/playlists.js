const playlistRouter = require('express').Router();
const playlists = require("../controllers/playlists.controller");

playlistRouter.get('/snapshot/:id', playlists.retrieveSnapshot);
playlistRouter.get('/public/:id', playlists.retrievePublic);
playlistRouter.get('/search', playlists.search);
playlistRouter.get('/:id', playlists.getPlaylist);
playlistRouter.get('/:id/metadata', playlists.getPlaylistMetadata);
playlistRouter.post('/:id/share', playlists.share);
playlistRouter.get('/', playlists.getPlaylists);

module.exports = playlistRouter;