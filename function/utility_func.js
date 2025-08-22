const { playlist_ } = require("../Schema/userSchema");
const title_model = require("../Schema/title_Schema");

module.exports.getplaylist_data = async function (id_list) {
    const list_ = await playlist_.findById(id_list);
    const ob = {};
    if (list_.track_ref.length !== 0) {
        const track_id = list_.track_ref[0];
        const name = list_.playist_name;
        const id_ = list_.id;
        const poster = await title_model.findById(track_id, 'img');
        Object.assign(ob, {
            name: name,
            poster: poster.img,
            id: id_
        })
        return ob;
    }
    else {
        return;
    }
}
module.exports.get_liked_track = async function (track_id) {
    const ob = {};
    const track_ = await title_model.findById(track_id, 'id track_name img');
    if (track_) {
        Object.assign(ob, {
            name: track_.track_name,
            poster: track_.img,
            id: track_.id
        })
        return ob;
    }
    else {
        return;
    }
}

module.exports.get_list_track = async function (track_) {
    const track = await title_model.findById(track_, 'id img track_name');
    let ob = {}
    if (track) {
        Object.assign(ob, {
            name: track.track_name,
            img: track.img,
            id: track.id
        })
        return ob;
    }
    else {
        return;
    }
}