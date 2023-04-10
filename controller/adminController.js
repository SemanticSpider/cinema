var async = require('async');
var User = require('../models/user');
var Film = require('../models/film');
var Seans = require('../models/seans');
var Ticket = require('../models/ticket');
var moment = require('moment');
const seans = require('../models/seans');
const user = require('../models/user');

exports.seans_list = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        seans: function(callback) {
            Seans.find().populate('film').exec(callback);
        },
    }, function(err, result) {
        if(err) return next(err);
        if(result.user == undefined) {
            res.redirect('/auth/registration');
            return;
        } else {
            res.render('seans_list', {title: 'Admin', user:result.user, seans: result.seans})
        }
    });
}

exports.seans_detail = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        seans: function(callback) {
            Seans.findById(req.params.id_seans).populate('film').exec(callback);
        },
    }, function(err, result) {
        if(err) return next(err);
        if(result.user == undefined) {
            res.redirect('/auth/registration');
            return;
        }

        res.render('seans_detail', { title: 'Seans detail', seans: result.seans, user: result.user })
    })
}

exports.create_seans_get = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        films: function(callback) {
            Film.find().exec(callback);
        }
    }, function(err, result) {
        if(err) return next(err);
        if(!result.user) {
            res.redirect('/auth/registration');
            return;
        }
        else res.render('form_seans', { title: 'Создание сеанса', user: result.user, films: result.films });
    })

}

exports.create_seans_post = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        seans: function(callback) {
            Seans.find({'hall':req.body.hall}).exec(callback);
        },
        film: function(callback) {
            Film.find({"name":req.body.film}).exec(callback);
        }
    }, function(err, result) {
        if(err) return next(err);
        if(!result.user) {
            res.redirect('/auth/registration');
            return;
        }
        // if() Условие для проверки зала
        const seans = new Seans({
            film: result.film[0],
            date: req.body.date,
            hall: req.body.hall,
            col_place: req.body.col_place,
        });

        seans.save(function(err) {
            if(err) {return next(err)}
            res.redirect(result.user.url + '/seans/' + seans.url);
        })
    })
}

exports.create_film_get = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
    }, function(err, result) {
        if(err) return next(err);
        if(!result.user) {
            res.redirect('/auth/registration');
            return;
        }
        else res.render('create_film', { title: 'Добавление фильма', user: result.user });
    })
}

exports.create_film_post = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        film: function(callback) {
            Film.find({"name":req.body.name}).exec(callback);
        },
        films: function(callback) {
            Film.find().exec(callback);
        }
    }, function(err, result) {
        if(err) return next(err);
        if(!result.user) {
            res.redirect('/auth/registration');
            return;
        }
        if(result.film.length > 0) {
            res.render('film_list', { title: 'Этот фильм уже существует', films: result.films, user: result.user });
            return;
        }
        const film = new Film({
            name: req.body.name,
            genre: req.body.genre,
            director: req.body.director,
            img: ''
        });

        film.save(function(err) {
            if(err) {return next(err)}
            let query = Film.find().exec();
            query.then(function(films) {
                console.log(query)
                res.render('film_list', {title: 'Список фильмов', user: result.user, films: films});
            })
        })
    })
}

exports.update_get = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        seans: function(callback) {
            Seans.findById(req.params.id_seans).populate('film').exec(callback);
        },
        films: function(callback) {
            Film.find().exec(callback);
        }

    }, function(err, result) {
        if(err) return next(err);
        if(!result.user) {
            res.redirect('/auth/registration');
            return;
        } else {
            res.render('form_seans', { title: 'Изменение сеанса', user: result.user, seans: result.seans, films: result.films, date: moment(result.seans.date).format('YYYY-MM-DThh:mm') });
        }
    })
}

exports.update_post = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        seans: function(callback) {
            Seans.findById(req.params.id_seans).exec(callback);
        },
        film: function(callback) {
            Film.find({ 'name': req.body.film }).exec(callback);
        },

    }, function(err, result) {
        if(err) return next(err);
        if(!result.user) {
            res.redirect('/auth/registration');
            return;
        } else {
           const seans = new Seans({
                film: result.film[0],
                date: req.body.date,
                hall: req.body.hall,
                col_place: req.body.col_place,
                _id:req.params.id_seans
           }) 

           Seans.findByIdAndUpdate(req.params.id_seans, seans, {}, function(err, seans) {
                if(err) return next(err);
                res.redirect(result.user.url + '/seans/' + result.seans.url);
           })
        }
    })
}

exports.delete_get = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        seans: function(callback) {
            Seans.findById(req.params.id_seans).populate('film').exec(callback);
        },
        ticket: function(callback) {
            Ticket.find({'seans':req.params.id_seans}).populate('user').exec(callback);
        },
    }, function(err, result) {
        if(err) return next(err);
        if(!result.user) {
            res.redirect('/auth/registration');
            return;
        } else {
            if(seans == null) res.redirect(result.user.url);
            res.render('delete_seans', { title: 'Seans delete', user: result.user, seans: result.seans, tickets: result.ticket });
        }
        
    })
}

exports.delete_post = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },
        seans: function(callback) {
            Seans.findById(req.body.id_seans).populate('film').exec(callback);
        },
        ticket: function(callback) {
            Ticket.find({'seans':req.params.id_seans}).populate('user').exec(callback);
        },
    }, function(err, result) {
        if(err) return next(err);
        if(!result.user) {
            res.redirect('/auth/registration');
            return;
        } else {
            if(result.ticket.length > 0) {
                res.render('delete_seans', { title: 'Seans delete', user: result.user, seans: result.seans, tickets: result.ticket });
            } else {
                Seans.findByIdAndDelete(req.body.id_seans, function(err) {
                    if(err) return next(err);
                    res.redirect(result.user.url);
                })
            }
        }
        
    })
}