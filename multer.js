const multer = require('multer');
const storage = multer.diskStorage({
    // setting multer strorage for our file uploading
    destination: function (req, file, callback) {
        if (file.fieldname === 'img') {
            callback(null, './twiceTagram/img');
        }
        else if (file.fieldname === 'audio') {
            callback(null, './twiceTagram/audio');
        }
        else {
            callback(null, './twiceTagram/user_img');
        }
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
})
const uploads = multer({ storage });
module.exports = uploads;