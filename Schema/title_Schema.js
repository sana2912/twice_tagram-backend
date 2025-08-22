
const mongoose = require('mongoose');
const { Schema } = mongoose;
const title_schema = new Schema({
    img: String,
    audio: String,
    id_img: String,
    id_audio: String,
    track_name: String,
    artist_name: String,
    label_name: String,
    releasing: String,
    track_lyric: String,
    view: Number,
}, { collection: "tagram_title_data" });

const title_model = mongoose.model('title_model', title_schema);
module.exports = title_model;