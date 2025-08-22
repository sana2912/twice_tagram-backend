const mongoose = require('mongoose');
const { Schema } = mongoose;

const admind_Schema = new Schema({
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
        unique: true,
    },
    first_name: String,
    last_name: String,
    position: String,
    track_created: [String]
}, { collection: 'adming_data' });

const admin_data = mongoose.model('admin_data', admind_Schema);
module.exports = admin_data;