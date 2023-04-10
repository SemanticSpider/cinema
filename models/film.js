var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FilmSchema = new Schema(
    {
        name: { type: String, required: true, max: 25 },
        genre: { type: String, required: true },
        director: {type: String, required: true},
        img: { type: String }
    }
)

FilmSchema
    .virtual('url')
    .get(function() {
        return '' + this._id;
});

module.exports = mongoose.model('Film', FilmSchema);
