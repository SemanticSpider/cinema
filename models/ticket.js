var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TicketSchema = new Schema(
    {
        user: { type: Schema.ObjectId, ref: 'User', required: true },
        seans: { type: Schema.ObjectId, ref: 'Seans', required:true },
        place: { type: Number, required: true },
    }
)

TicketSchema
    .virtual('url')
    .get(function() {
        return '/client/' + this.user._id + '/ticket/' + this._id;
});

module.exports = mongoose.model('Ticket', TicketSchema);

