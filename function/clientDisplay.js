const { get } = require("mongoose");
const appError = require("../Err_app");
const title_model = require("../Schema/title_Schema");
const { user, playlist_ } = require("../Schema/userSchema");
const utility_func = require("./utility_func");
module.exports.home_disaplay = async (req, res, next) => {
    try {
        const { dis } = req.params;
        if (dis === 'default') {
            const data = await title_model.find({}, 'id img track_name').limit(10);
            res.status(200).json({ success: true, message: data });
        }
        else {
            const data = await title_model.find({}, 'id img track_name')
                .sort({ view: -1 })
                .limit(10);
            res.status(200).json({ success: true, message: data });
        }
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}
module.exports.title_display = async (req, res, next) => {
    try {
        const { dis } = req.params;
        if (dis === 'default') {
            const data_display = await title_model.find({}, 'id img track_name')
            res.status(200).json({ success: true, message: data_display });
        }
        else {
            const data_display = await title_model.find({}, 'id img track_name')
                .sort({ view: -1 })
            res.status(200).json({ success: true, message: data_display });
        }
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}
module.exports.track_display = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user;
        const track_ = await title_model.findById(id);
        if (user_id) {
            const love_list = await islove_list(id, user_id);
            res.status(200)
                .json({
                    img: track_.img,
                    audio: track_.audio,
                    track: track_.track_name,
                    artist: track_.artist_name,
                    label: track_.label_name,
                    releasing: track_.releasing,
                    lyric: track_.track_lyric,
                    view: track_.view,
                    is_loggin: true,
                    is_love: love_list[0],
                    is_list: love_list[1]
                })
        }
        else {
            res.status(200)
                .json({
                    img: track_.img,
                    audio: track_.audio,
                    track: track_.track_name,
                    artist: track_.artist_name,
                    label: track_.label_name,
                    releasing: track_.releasing,
                    lyric: track_.track_lyric,
                    view: track_.view,
                    is_loggin: false,
                })
        }
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}
module.exports.playlists_display = async function (req, res, next) {
    try {
        const user_ = await user.findById(req.user);
        let list = [];
        if (user_.playlist.length !== 0) {
            for (let id_list of user_.playlist) {
                const ob = await utility_func.getplaylist_data(id_list);
                list.push(ob);
            };
            res.status(200).json({ message: list });
        }
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}
module.exports.like_display = async function (req, res, next) {
    try {
        const user_ = await user.findById(req.user);
        let like = [];
        if (user_.like.length !== 0) {
            for (let track_id of user_.like) {
                const ob = await utility_func.get_liked_track(track_id);
                like.push(ob);
            };
            res.status(200).json({ message: like });
        }
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}

module.exports.list_track_display = async function (req, res, next) {
    try {
        const { list_id } = req.params;
        const list_ = await playlist_.findById(list_id);
        let tracks = [];
        if (list_.track_ref) {
            for (let track_ of list_.track_ref) {
                const ob = await utility_func.get_list_track(track_);
                tracks.push(ob);
            }
            res.status(200).json({ tracks: tracks });
        }
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}

async function islove_list(id, user_id) {
    const user_ = await user.findById(user_id);
    const islove = user_.like.includes(id);
    const list = [];
    for (let list_id of user_.playlist) {
        const num = await getplaylist_data(list_id, id);
        list.push(num);
    }
    const islist = list.includes(1);
    return [islove, islist];
}
async function getplaylist_data(list_id, id) {
    const list_ = await playlist_.findById(list_id);
    if (list_.track_ref.includes(id)) { return 1; }
    else { return 0; }
}
