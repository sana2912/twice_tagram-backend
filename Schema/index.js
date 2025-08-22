// use this page for testing unit
const mongoose = require('mongoose');
const { user, playlist_ } = require('./userSchema');
const title_model = require('./title_Schema');

mongoose.connect('mongodb://127.0.0.1:27017/TwiceTagram')
    .then(() => console.log('connecting success'))
    .catch((err_message) => {
        console.log('connecting fail');
        console.log(err_message);
    })
const feild = 'girl like us'
async function testing() {
    const track_ = await title_model.find({ track_name: new RegExp(feild, 'i') }, 'track_name').limit(5);
    console.log(track_);
}
testing();
