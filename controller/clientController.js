var async = require('async');
var User = require('../models/user');
var Film = require('../models/film');
var Seans = require('../models/seans');
var Ticket = require('../models/ticket');
var moment = require('moment');
const ticket = require('../models/ticket');

exports.profile = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        ticket_count: function(callback) {
            Ticket.find({ 'user': req.params.id }).countDocuments({}, callback);
        },
    }, function(err, result) {
        if(err) return next(err);
        if(result.user == undefined) {
            res.redirect('/auth/registration')
        } else {
            res.render('client_profile', {title: 'Your profile', user: result.user, tickets: result.ticket_count});
        }
    })
}

exports.ticket_list = function(req, res, next) {
    async.series({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },

        tickets: function(callback) {
            Ticket.find({'user':req.params.id}).populate('seans').exec(callback);
        },

        films: function(callback) {
            Film.find().exec(callback);
        }
    }, function(err, result) {
        if(err) return next(err);
        if(result.user == undefined) {
            res.redirect('/auth/registration')
        } else {
            for(let i = 0; i < result.tickets.length; i++){
                result.tickets[i].film = result.films.find(film => film._id.toString() == result.tickets[i].seans.film.toString());
                result.tickets[i].date = moment(result.tickets[i].seans.date).format('DD MMM, YYYY, hh:mm');
                if(result.tickets[i].place > result.tickets[i].seans.col_place) result.tickets[i].place = result.tickets[i].seans.col_place - (result.tickets[i].place - result.tickets[i].seans.col_place)
            }

            res.render('ticket_list', {title: 'Your ticket list', user: result.user, tickets: result.tickets});
        }
    })
}

exports.seans_list = function(req, res, next) {
    async.series({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },

        seans: function(callback) {
            Seans.find().populate('film').exec(callback);
        },

    }, function(err, result) {
        if(err) return next(err);
        if(result.user == undefined) {
            res.redirect('/auth/registration')
        } else {
            res.render('seans_list', { title: 'Seans List', user: result.user, seans: result.seans })
        }
    })
}

// exports.film_list = function(req, res, next) {
//     async.series({
//         user: function(callback) {
//             User.findById(req.params.id).exec(callback);
//         },

//         films: function(callback) {
//             Film.find().exec(callback);
//         }
//     }, function(err, result) {
//         if(err) return next(err);
//         if(result.user == undefined) {
//             res.redirect('/auth/registration')
//         } else {
//             res.render('film_list', { title: 'Your ticket list', user: result.user, films: result.films });
//         }
//     })
// }

exports.seans_detail_get = function(req, res, next) {
    async.series({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },

        tickets: function(callback) {
            Ticket.find({'seans':req.params.seans_id}).exec(callback);
        },

        seans: function(callback) {
            Seans.findById(req.params.seans_id).populate('film').exec(callback);
        },

    }, function(err, result) {
        if(err) return next(err);
        if(result.user == undefined) {
            res.redirect('/auth/registration')
        } else {
            const freedom_place = [];
            for(let i = 1; i <= Number(result.seans.col_place); i++) {
                freedom_place.push(i);
            }
            for(let ticket of result.tickets) {
                console.log(ticket)
                if(freedom_place.includes(Number(ticket.place))) {
                    freedom_place.splice(freedom_place.indexOf(Number(ticket.place)), 1);
                }
            }
            res.render('seans_detail', { title: 'Seans List', user: result.user, seans: result.seans, tickets: result.tickets, freedom_place: freedom_place })
        }
    })
}

exports.seans_detail_post = function(req, res, next) {
    async.series({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        
        tickets: function(callback) {
            Ticket.find({ 'user':req.params.id }).exec(callback);
        },

        seans: function(callback) {
            Seans.findById(req.params.seans_id).populate('film').exec(callback);
        },

    }, function(err, result) {
        if(err) return next(err);
        if(result.user == undefined) {
            res.redirect('/auth/registration')
        } else {
            const ticket = new Ticket({
                seans: req.params.seans_id,
                user: req.params.id,
                place: req.body.place
            });
            ticket.save(function(err) {
                if(err) { return next(err) }
                res.redirect(result.user.url + '/ticket');
            })
        }
    })
}

exports.film_detail = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        film: function(callback) {
            Film.findById(req.params.film_id).exec(callback);
        },
    }, function(err, result) {
        if(err) return next(err);
        if(result.user == undefined) {
            res.redirect('/auth/registration');
        } else {
            res.render('film_detail', { title: 'Detail about ' + result.film.name, user: result.user, film: result.film });
        }
    })
}
