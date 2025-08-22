const mongoose = require('mongoose');
const { Schema } = mongoose;

const playlist_schema = new Schema({
    playist_name: String,
    user_ref: String,
    track_ref: [String]
}, { collection: 'tagram_user_playlist' });

const user_schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    ig_: String,
    faceBook_: String,
    profile: String,
    playlist: [String],
    like: [String]
}, { collection: "tagram_user_profile" });

const playlist_ = mongoose.model('playlist_', playlist_schema);
const user = mongoose.model('user', user_schema);
module.exports = {
    playlist_: playlist_,
    user: user
}