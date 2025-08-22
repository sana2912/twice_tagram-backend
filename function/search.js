const appError = require("../Err_app");
const title_model = require("../Schema/title_Schema");

module.exports.search_engine = async function (req, res, next) {
    try {
        const { field } = req.params;
        const track_ = await title_model.find({ track_name: new RegExp(field, 'i') }, 'track_name').limit(5);
        res.status(200).json({ track_ });
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}
module.exports.search_display_track = async function (req, res, next) {
    try {
        const { field } = req.params;
        const track_ = await title_model.find({ track_name: field }, 'id img track_name');
        res.status(200).json({
            message: track_
        })
    }
    catch (err) {
        console.error(err);
        throw new appError(err.stack, 500);
    }
}