var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SeansSchema = new Schema(
    {
        film: { type: Schema.ObjectId, ref: 'Film', required: true },
        date: { type: Date, required: true },
        hall: { type: Number, required:true },
        col_place: { type: Number, required: true },
    }
);

SeansSchema
    .virtual('url')
    .get(function() {
        return '' + this._id
});

module.exports = mongoose.model('Seans', SeansSchema);