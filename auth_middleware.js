require('dotenv').config();
const jwt = require('jsonwebtoken');

function twice_permission(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: 'not accout yet',
            location: `${process.env.FRONTEND_ORIGIN}/validation/login.html`
        });
    }
    try {
        const user_token = jwt.verify(token, process.env.USER_SECRET); // ✅ verify signature + exp
        req.user = user_token.user_id;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            message: 'invalid or expired token',
            location: `${process.env.FRONTEND_ORIGIN}/validation/login.html`
        });
    }

}
function interact_permession(req, res, next) {
    const token = req.cookies.token;
    if (!token) return next(); // guest mode
    try {
        const user_token = jwt.verify(token, process.env.USER_SECRET); // ✅ verify
        req.user = user_token.user_id;
    } catch (err) {
        console.error(err);
        // guest mode → ไม่ต้องทำอะไร
    }
    next();
}
function admin_permission(req, res, next) {
    const token = req.cookies.admin_token;
    if (!token) {
        return res.status(401).json({
            message: 'not accout yet',
            location: `${process.env.FRONTEND_ORIGIN}/admin/management/authenticate.html`,
        });
    }
    try {
        const admin_token = jwt.verify(token, process.env.ADMIN_SECRET);
        req.admin = admin_token.admin_id;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            message: 'invalid or expired admin token',
            location: `${process.env.FRONTEND_ORIGIN}/admin/management/authenticate.html`
        });
    }
}
module.exports = { twice_permission, interact_permession, admin_permission };