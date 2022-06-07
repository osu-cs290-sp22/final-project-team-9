module.exports = mongoose => {
    const AutoIncrement = require('mongoose-sequence')(mongoose);
    var schema = mongoose.Schema({
        playlist: String,
        variables: Array,
        graphType: String,
        _id: Number,
    }, { timestamps: true, _id: false })

    schema.plugin(AutoIncrement);
    const Share = mongoose.model("share", schema);
    return Share;
};