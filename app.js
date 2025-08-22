const express = require('express');
const mongoose = require('mongoose');
const app = express();
const admin_post_function = require('./function/admin_post');
const uploads = require('./multer');
const client__display = require('./function/clientDisplay');
const user_ma_function = require('./function/user_MA');
const remove_func = require('./function/remove_function');
const search_func = require('./function/search');
const user_val_function = require('./function/user_validation');
const admind_regis = require('./function/admin_val');
const { twice_permission, interact_permession, admin_permission } = require('./auth_middleware');
const cookieparser = require('cookie-parser');
const port = 3000;
const cors = require('cors');
require('dotenv').config;
// set the domain that this server will accept diffrent request from other domen
// learn more at : https://article.arunangshudas.com/how-would-you-manage-cors-in-a-production-express-js-application-45a1138dd6df

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());


mongoose.connect(process.env.MONGODB_URl)
    .then(() => console.log('connecting success'))
    .catch((err_message) => {
        console.log('connecting fail');
        console.log(err_message);
    })

// search field 
app.get('/twiceTagram/search/:field', search_func.search_engine);
app.get('/twiceTagram/search_display/:field', search_func.search_display_track);

// main UI section
app.get('/twiceTagram/display/profile/list', twice_permission, client__display.playlists_display);
app.get('/twiceTagram/display/profile/like', twice_permission, client__display.like_display);
app.get('/twiceTagram/display/profile/track_list/:list_id', twice_permission, client__display.list_track_display);
app.get('/twiceTagram/display/profile/main/:section', twice_permission, user_ma_function.daisplay_profile);
app.get('/twiceTagram/display/:id', interact_permession, client__display.track_display);
app.get('/twiceTagram/display_all/:dis', client__display.title_display);
app.get('/twiceTagram/home/:dis', client__display.home_disaplay);

// main profile UI section
app.delete('/twiceTagram/display/profile/list/:list_id', twice_permission, remove_func.playlist_remove);
app.delete('/twiceTagram/display/profile/like/:track_id', twice_permission, remove_func.like_removing);
app.delete('/twiceTagram/display/profile/track_list/:list_id/:track_id', twice_permission, remove_func.track_list_remove);

// user profile management  section
app.get('/twiceTagram/profile/form/:track_id', twice_permission, user_ma_function.playlist_data);
app.post('/twiceTagram/profile/form/:track_id', twice_permission, user_ma_function.update_playlist);
app.post('/twiceTagram/profile/like/:track_id', twice_permission, user_ma_function.like_adding);
app.delete('/twiceTagram/profile/like/:track_id', twice_permission, remove_func.like_removing);
// user validation section
app.post('/twiceTagram/user/validation/profile_config',
    uploads.single('img_profile'),
    user_val_function.user_profile_config
);
app.post('/twiceTagram/user/validation/login', user_val_function.login_function);
app.post('/twiceTagram/user/validation/logout', user_val_function.logout_function)


// admin section
// authenticate section
app.post('/twiceTagram/dashboard/register', admind_regis.register_admin_data);
app.post('/twiceTagram/dashboard/login', admind_regis.login_admin_function);
app.post('/twiceTagram/dashboard/logout', admind_regis.logout_admin_function);

// dashboard section
app.get('/twiceTagram/dashboard/admindDashboard', admin_permission, admin_post_function.getTrack_for_dasboard);
app.get('/twiceTagram/dashboard/title/update/:id', admin_permission, admin_post_function.serve_formData);
app.post('/twiceTagram/dashboard/title/create_form', admin_permission,
    uploads.fields([
        { name: 'audio', maxCount: 1 },
        { name: 'img', maxCount: 1 }
    ]),
    admin_post_function.title_post
);
app.put('/twiceTagram/dashboard/title/update/:id', admin_permission,
    uploads.fields([
        { name: 'audio', maxCount: 1 },
        { name: 'img', maxCount: 1 }
    ]),
    admin_post_function.update_track
)
app.delete('/twiceTagram/dashboard/title/remove/:id', admin_permission, admin_post_function.remove_data);

app.use((err, req, res, next) => {
    const { status, message } = err;
    res.status(status || 500).json({ success: false, message: message || 'error from sever' });
});
app.listen(port, () => {
    console.log('this is my express app');
});

