require('dotenv').config;
const appErr = require('./Err_app');
const jwtD = require('jwt-decode');
const { jwtDecode } = jwtD;
async function twice_permission(req, res, next) {
    const token = req.cookies.token;
    try {
        if (token) {
            const user_token = jwtDecode(token);
            req.user = user_token.user_id;
            next();
        } else {
            return res.status(401).json({
                message: 'notACC',
                location: `${process.env.FRONTEND_ORIGIN}/validation/login.html`
            });
        }
    }
    catch (err) { console.error(err); }
}
function interact_permession(req, res, next) {
    const token = req.cookies.token;
    try {
        if (token) {
            const user_token = jwtDecode(token);
            req.user = user_token.user_id;
            next();
        } else {
            next();
        }
    }
    catch (err) { console.error(err); }
}
function admin_permission(req, res, next) {
    const token = req.cookies.admin_token;
    try {
        if (token) {
            const user_token = jwtDecode(token);
            req.admin = user_token.admin_id;
            next();
        } else {
            return res.status(401).json({
                message: 'notACC',
                location: `${process.env.FRONTEND_ORIGIN}/admin/management/authenticate.html`,
            });
        }
    }
    catch (err) { console.error(err); }
}
module.exports = { twice_permission, interact_permession, admin_permission };