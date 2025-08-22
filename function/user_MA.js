const appError = require("../Err_app");
const title_model = require("../Schema/title_Schema");
const { playlist_, user } = require("../Schema/userSchema");
const utility_func = require("./utility_func");

module.exports.daisplay_profile = async function (req, res, next) {
    try {
        const { section } = req.params;
        const user_ = await user.findById(req.user);
        if (section === 'profile') {
            res.status(200).json({
                profile: user_.profile,
                username: user_.username,
                ig: user_.ig_,
                fb: user_.faceBook_,
                id: user_.id
            });
        }
        else if (section === 'list') {
            let lists = [];
            if (user_.playlist.length !== 0) {
                for (let list_id of user_.playlist) {
                    const limit = user_.playlist.indexOf(list_id);
                    if (limit === 4) break;
                    const ob = await utility_func.getplaylist_data(list_id);
                    lists.push(ob);
                }
                res.status(200).json({ data: lists });
            }
            else {
                res.status(200).json({ data: [] });
            }
        }
        else if (section === 'like') {
            let likes = [];
            if (user_.like.length !== 0) {
                for (let track_id of user_.like) {
                    const limit = user_.like.indexOf(track_id);
                    if (limit === 5) break;
                    const ob = await utility_func.get_liked_track(track_id);
                    likes.push(ob);
                }
                res.status(200).json({ data: likes });
            } else {
                res.status(200).json({ data: [] });
            }
        }
        else {
            throw new appError("we not find your section", 500);
        }
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}
module.exports.playlist_data = async (req, res, next) => {
    try {
        const { track_id } = req.params;
        const user_id = req.user;
        const get_user = await user.findById(user_id);
        const list_ = [];
        if (get_user.playlist.length !== 0) {
            for (let list_id of get_user.playlist) {
                const ob = await getplaylist_data(list_id, track_id);
                list_.push(ob);
            }
        }
        res.status(200).json({
            success: true,
            list: list_,
        });
    }
    catch (err) {
        console.err(err);
        throw new appError(err.stack, 500);
    }
}
async function getplaylist_data(list_id, track_id) {
    const ob = await playlist_.findById(list_id);
    const checked = ob.track_ref.includes(track_id) ? true : false;
    const data = {
        id: list_id,
        name: ob.playist_name,
        checked: checked
    };
    return data;
}
module.exports.update_playlist = async (req, res, next) => {
    try {
        const { track_id } = req.params;
        const user_id = req.user;
        const ob = req.body;
        for (let el in ob) {
            if (ob[el].id === 'creating') {
                await create_list(track_id, user_id, ob[el].name);
            }
            else {
                update_list(ob[el].id, ob[el].state, track_id,);
            }
        }
        res.status(200).json({ data: 'complete' });
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}

module.exports.like_adding = async function (req, res, next) {
    try {
        const { track_id } = req.params;
        const user_id = req.user;
        const user_ = await user.findById(user_id);
        user_.like.push(track_id);
        await user_.save();
        res.status(200).json({ message: 'complete' });
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}

async function create_list(track_id, user_id, name) {
    const track_ = await title_model.findById(track_id);
    const user_ = await user.findById(user_id);
    const create = playlist_({ playist_name: name });
    create.track_ref.push(track_._id);
    create.user_ref = user_._id;
    await create.save();
    user_.playlist.push(create._id);
    await user_.save();
}
async function update_list(id, state, track_id) {
    const track_ = await title_model.findById(track_id);
    const list_ = await playlist_.findById(id);
    if (state === 'add') {
        // adding track to playlist
        if (!list_.track_ref.includes(track_id)) {
            list_.track_ref.push(track_.id);
            await list_.save();
        }
    }
    else {
        if (list_.track_ref.includes(track_id)) {
            const index = list_.track_ref.indexOf(track_id);
            list_.track_ref.splice(index, 1);
            await list_.save();
        }
    }
}