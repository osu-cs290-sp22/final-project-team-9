module.exports = mongoose => {
    var schema = mongoose.Schema({
        collaborative: Boolean,
        description: String,
        external_urls: Object,
        href: String,
        id: String,
        images: Array,
        name: String,
        owner: Object,
        primary_color: String,
        public: Boolean,
        snapshot_id: String,
        tracks: Object,
        trackList: Array,
        trackMetadata: Array,
        type: String,
        uri: String,
    }, { timestamps: true })

    const Playlists = mongoose.model("playlists", schema);
    return Playlists;
};