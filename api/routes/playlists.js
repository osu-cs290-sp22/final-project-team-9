const playlistRouter = require('express').Router();
const playlists = require("../controllers/playlists.controller");

playlistRouter.get('/snapshot/:id', playlists.retrieveSnapshot);
playlistRouter.get('/public/:id', playlists.retrievePublic);
playlistRouter.get('/search', playlists.search);
playlistRouter.delete('/graphs/delete/:id', playlists.deleteGraph);
playlistRouter.get('/:id', playlists.getPlaylist);
playlistRouter.get('/:id/metadata', playlists.getPlaylistMetadata);
playlistRouter.post('/:id/share', playlists.share);
playlistRouter.post('/:id/image', playlists.updateImage);
playlistRouter.post('/:id/save', playlists.saveGraph);
playlistRouter.get('/', playlists.getPlaylists);

module.exports = playlistRouter;