var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        login: { type: String, required: true, max: 100 },
        password: { type: String, required: true, min: 8, max: 16 },
        admin:  { type: Boolean, required: true },
    }
);

UserSchema
    .virtual('url')
    .get(function(){
        if (this.admin) {
            return '/admin/' + this._id;
        } else return '/client/' + this._id;
});

// var UserModel = mongoose.model('User', UserSchema);

module.exports = mongoose.model('User', UserSchema);