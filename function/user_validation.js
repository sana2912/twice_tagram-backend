const fs = require('fs');
const appError = require("../Err_app");
const { user } = require("../Schema/userSchema");
const { cloudinary } = require("../cloud");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = 'twice_Tagram_user_secret';
module.exports.user_profile_config = async function (req, res, next) {
    try {
        const ob = req.body;
        const user_email = await user.findOne({ email: ob.email });
        if (user_email) {
            res.status(401).json({ message: "บัญชีนี้ถูกใช้แล้ว" });
            return;
        }
        const user_img = req.file;
        const original_name = user_img.originalname.substring(0, user_img.originalname.length - 4);
        const profile_url = await upload_to_cloud(original_name, user_img);
        const user_id = await upload_to_DB(ob, profile_url);
        fs.unlinkSync(user_img.path);
        const token = jwt.sign({ user_id: user_id }, secret);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 60 * 60 * 1000,
            path: '/',
        }).status(200).json({ message: "complete", user_profile: profile_url });
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}

module.exports.login_function = async function (req, res, next) {
    const { username, password } = req.body;
    try {
        const getuser = await user.findOne({ username });
        if (!getuser) {
            res.status(401).json({ message: "เราไม่พบบัญชีของคุณกรุณาลงทะเบียน" });
        } else {
            const ismatch = await bcrypt.compare(password, getuser.password);
            if (ismatch) {
                const token = jwt.sign({ user_id: getuser._id }, secret);
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 60 * 60 * 1000,
                    path: '/',
                }).status(200).json({ message: 'complete', user_profile: getuser.profile });
            }
            else {
                res.status(401).json({ message: 'รหัสผ่านของคุณไม่ถูกต้อง' });
            }
        }
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}
module.exports.logout_function = async function (req, res, next) {
    try {
        res.clearCookie('token', {
            path: '/'
        }).status(200).json({ message: 'log out complete' });
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}
async function upload_to_cloud(file_name, file) {
    const profile_uploads = await cloudinary.uploader.upload(file.path, {
        public_id: file_name,
        folder: 'twice_tagram/user',
        transformation: [
            { aspect_ratio: "1.0", width: 400, crop: "fill" },
            { radius: "max" },
            { fetch_format: "auto" }
        ],
    })
    return profile_uploads.url;
}
async function upload_to_DB(ob, profile_url) {
    const hash_passwordd = await bcrypt.hash(ob.password, 10);
    const new_user = new user({
        email: ob.email,
        username: ob.username,
        password: hash_passwordd,
        ig_: ob.ig,
        faceBook_: ob.fb,
        profile: profile_url
    })
    await new_user.save();
    return new_user._id;
}