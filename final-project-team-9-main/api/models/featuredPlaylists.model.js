module.exports = mongoose => {
    var schema = mongoose.Schema({
        playlists: Array,
    }, { timestamps: true })

    const FeaturedPlaylists = mongoose.model("featured-playlists", schema);
    return FeaturedPlaylists;
};