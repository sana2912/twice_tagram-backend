const appErr = require('../Err_app');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const title_model = require('../Schema/title_Schema');
const admin_data = require('../Schema/admin_Schema');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
module.exports.getTrack_for_dasboard = async (req, res, next) => {
    try {
        const admin_ = await admin_data.findById(req.admin, 'username track_created');
        let obDATA = [];
        if (admin_.track_created.length !== 0) {
            for (let tracks of admin_.track_created) {
                const each_track = await title_model.findById(tracks, 'track_name img');
                obDATA.push(each_track);
            }
            res.status(200).json({ admin: admin_.username, data: obDATA });
        }
        else {
            res.status(202).json({ admin: admin_.username, message: "no tracks thet you create" });
        }
    }
    catch (err) {
        console.error(err);
        throw new appErr('something was wrong at /dashboard/title/create_form app.js', 500);
    }
}
module.exports.title_post = async (req, res, next) => {
    try {
        const admin_id = req.admin;
        const imgFile = req.files['img']?.[0];
        const audioFile = req.files['audio']?.[0];
        const img_name = imgFile.originalname.substring(0, imgFile.originalname.length - 4);
        const audio_name = audioFile.originalname.substring(0, audioFile.originalname.length - 4);
        const img_path = await upload_img(imgFile.path, img_name);
        const audio_path = await upload_audio(audioFile.path, audio_name);
        await creat_title(req.body, img_path, audio_path, admin_id);
        fs.unlinkSync(imgFile.path);
        fs.unlinkSync(audioFile.path);
        res.status(200).json({ success: true, message: 'Uploaded!' });
    } catch (err) {
        console.error(err);
        throw new appErr('something was wrong at /dashboard/title/create_form app.js', 500);
    }
}
module.exports.serve_formData = async function (req, res, next) {
    try {
        const { id } = req.params;
        const obDATA = await title_model.findById(id);
        res.status(200).json(obDATA);
    }
    catch (err) {
        console.error(err)
        throw new appErr('something was wrong at /dashboard/title/update/:id app.js', 500);
    }
}
module.exports.update_track = async function (req, res, next) {
    try {
        const { id } = req.params;
        const audioFile = req.files['audio']?.[0];
        const imgFile = req.files['img']?.[0];
        const new_data = await update_cloud(audioFile, imgFile, req.body, id);
        await title_model.findByIdAndUpdate(id, new_data);
        if (audioFile) { fs.unlinkSync(audioFile.path) };
        if (imgFile) { fs.unlinkSync(imgFile.path) };
        res.status(200).json({ success: true, new_data });
    }
    catch (err) {
        console.error(err)
        throw new appErr(err.stack, 500);
    }
}
module.exports.remove_data = async function (req, res, next) {
    try {
        const { id } = req.params;
        const track_at_admin = await admin_data.findById(req.admin);
        const remove = await title_model.findByIdAndDelete(id);
        if (track_at_admin.track_created.includes(id)) {
            await cloudinary.uploader.destroy(remove.id_img, {
                resource_type: 'image'
            })
            await cloudinary.uploader.destroy(remove.id_audio, {
                resource_type: "video",
            })
            const index = track_at_admin.track_created.indexOf(id);
            track_at_admin.track_created.splice(index, 1);
            await track_at_admin.save();
            res.status(200).json({ success: true, message: 'remove data success' });
        }
        else {
            res.status(500).json({ success: false, message: 'not find your track' });
        }
    }
    catch (err) {
        console.error(err);
        throw new appErr(err.stack, 500);
    }
}
async function creat_title(ob, img_, audio_, admin_id) {
    const { title, artist, label, year, lyrics } = ob;
    const number = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
    const add_track = new title_model({
        img: img_.url,
        audio: audio_.url,
        id_img: img_.public_id,
        id_audio: audio_.public_id,
        track_name: title,
        artist_name: artist,
        label_name: label,
        releasing: year,
        track_lyric: lyrics,
        view: number
    });
    const push_track = await admin_data.findById(admin_id);
    push_track.track_created.push(add_track._id);
    await add_track.save();
    await push_track.save();
}
async function update_cloud(audio_, img_, ob, id) {
    const { title, artist, label, year, lyrics } = ob;
    const new_ob = {};
    const get_file = await title_model.findById(id, 'img audio id_img id_audio');
    if (img_) {
        await cloudinary.uploader.destroy(get_file.id_img, { resource_type: 'image' });
        const img_name = img_.originalname.substring(0, img_.originalname.length - 4);
        const update_ = await upload_img(img_.path, img_name);
        Object.assign(new_ob, { img: update_.url, id_img: update_.public_id });
    } else {
        Object.assign(new_ob, {
            img: get_file.img,
            id_img: get_file.id_img
        });
    }
    if (audio_) {
        await cloudinary.uploader.destroy(get_file.id_audio, { resource_type: 'video' });
        const audio_name = audio_.originalname.substring(0, audio_.originalname.length - 4);
        const update_ = await upload_audio(audio_.path, audio_name);
        Object.assign(new_ob, { audio: update_.url, id_audio: update_.public_id });
    } else {
        Object.assign(new_ob, {
            audio: get_file.audio,
            id_audio: get_file.id_audio
        });
    }
    Object.assign(new_ob, {
        track_name: title,
        artist_name: artist,
        label_name: label,
        releasing: year,
        track_lyric: lyrics
    });
    return new_ob;
}

async function upload_img(path, img_name) {
    const img_path = await cloudinary.uploader.upload(path, {
        public_id: img_name,
        folder: 'twice_tagram/image',
        resource_type: "image"
    });
    return img_path;
}
async function upload_audio(path, audio_name) {
    const audio_path = await cloudinary.uploader.upload(path, {
        public_id: audio_name,
        folder: 'twice_tagram/audio',
        resource_type: "video"
    });
    return audio_path;
}