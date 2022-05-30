require('dotenv').config();

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB_URI;

db.featuredPlaylists = require("./featuredPlaylists.model.js")(mongoose);
db.playlists = require("./playlists.model.js")(mongoose);

module.exports = db;