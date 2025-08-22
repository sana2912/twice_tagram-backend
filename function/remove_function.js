const appError = require("../Err_app");
const { user, playlist_ } = require("../Schema/userSchema");

module.exports.like_removing = async function (req, res, next) {
    try {
        const { track_id } = req.params;
        const user_ = await user.findById(req.user);
        const index = user_.like.indexOf(track_id);
        user_.like.splice(index, 1);
        await user_.save();
        res.status(200).json({ message: 'remove success' });
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}

module.exports.playlist_remove = async function (req, res, next) {
    try {
        const { list_id } = req.params;
        const user_ = await user.findById(req.user);
        if (user_.playlist.includes(list_id)) {
            const list_ = await playlist_.findByIdAndDelete(list_id);
            const index = user_.playlist.indexOf(list_id);
            user_.playlist.splice(index, 1);
            await user_.save();
            res.status(200).json({ message: "success removing" });
        }
        else {
            throw new appError('removing yur playlist fail', 500);
        }
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}
module.exports.track_list_remove = async function (req, res, next) {
    try {
        const { list_id, track_id } = req.params;
        const list_ = await playlist_.findById(list_id, 'track_ref');
        if (list_.track_ref.includes(track_id)) {
            const index = list_.track_ref.indexOf(track_id);
            list_.track_ref.splice(index, 1);
            await list_.save();
            res.status(200).json({ message: 'remove success' });
        }
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}