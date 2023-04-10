console.log('This script create cinema bd');

var userArgs = process.argv.slice(2);

var async = require('async');
var Film = require('./models/film');
var Seans = require('./models/seans');
var User = require('./models/user');
var Ticket = require('./models/ticket');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

var films = [];
var seans = [];
var users = [];
var tickets = [];

function filmCreate(name, genre, director, img, cb) {
    filmDetail = { name: name, genre: genre, director: director };
    if (img != false) filmDetail.img = img;

    var film = new Film(filmDetail);
    film.save(function(err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('new film ' + film);
        films.push(film);
        cb(null, film);
    });
}

function usersCreate(login, password, admin, cb) {
    var userDetail = { login: login, password: password, admin: admin };
    var user = new User(userDetail);
    user.save(function(err) {
        if(err) {
            cb(err, null);
            return;
        }
        console.log('new user welcome ' + user);
        users.push(user);
        cb(null, user);
    });
}

function createUsers(cb) {
    async.parallel([
        function(callback) {
            usersCreate('Admin1', '1234', true, callback);
        },
        function(callback) {
            usersCreate('Adm', 'Pasw6783', true, callback);
        },
        function(callback) {
            usersCreate('AdminLr', 'professorAngel179', true, callback);
        },
        function(callback) {
            usersCreate('Shoggot', 'Azatot', false, callback);
        },
    ], cb);
}

function createFilms(cb) {
    async.parallel([
        function(callback) {
            filmCreate('Color of another world', 'horror', 'Richard Stanely', false, callback);
        },
        function(callback) {
            filmCreate('Ancient', 'horror', 'Jamie Yuss', false, callback);
        },
    ], cb)
}

async.series([
    createUsers,
    createFilms,
], function(err, res) {
    if(err) {
        console.log('Final err', err);
    } else {
        console.log('Users ' + users);
    }
    mongoose.connection.close();
})
