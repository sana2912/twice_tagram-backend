require('dotenv').config();
const appError = require("../Err_app");
const admin_data = require("../Schema/admin_Schema");
const jwt = require('jsonwebtoken');
const SECRET = process.env.ADMIN_SECRET
const bcrypt = require('bcryptjs');
module.exports.register_admin_data = async function (req, res, next) {
    try {
        const ob = req.body;
        const admin_email = await admin_data.findOne({ email: ob.email });
        if (admin_email) {
            res.status(401).json({ message: "บัญชีนี้ถูกใช้แล้ว" });
            return;
        }
        const admin_ = await create_new_admin(ob);
        const token = jwt.sign({ admin_id: admin_.id, position: admin_.position }, SECRET);
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 60 * 60 * 1000,
            path: '/',
        }).status(200).json({ message: "complete", username: admin_.username });
    }
    catch (err) {
        console.log(err);
        throw new appError(err.stack, 500);
    }
}
module.exports.login_admin_function = async function (req, res, next) {
    const { username, password, position } = req.body;
    try {
        const get_admin = await admin_data.findOne({ username: username });
        if (!get_admin) {
            res.status(401).json({ message: "เราไม่พบบัญชีของคุณกรุณาลงทะเบียน" });
        } else {
            const ismatch = await bcrypt.compare(password, get_admin.password);
            if (ismatch) {
                const token = jwt.sign({ admin_id: get_admin._id, position: position }, SECRET);
                res.cookie('admin_token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 60 * 60 * 1000,
                    path: '/',
                }).status(200).json({ message: 'complete', username: get_admin.username });
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
module.exports.logout_admin_function = async function (req, res, next) {
    try {
        res.clearCookie('admin_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
        }).status(200).json({ message: 'log out complete' });
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}

async function create_new_admin(ob) {
    const hash_password = await bcrypt.hash(ob.password, 10);
    const set_admin_data = new admin_data({
        email: ob.email,
        first_name: ob.first_name,
        last_name: ob.last_name,
        password: hash_password,
        position: ob.position,
        username: ob.username,
    })
    await set_admin_data.save();
    return {
        id: set_admin_data._id,
        position: set_admin_data.position,
        username: set_admin_data.username
    };
}