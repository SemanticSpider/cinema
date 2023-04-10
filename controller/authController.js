User = require('../models/user');
async = require('async');

exports.registration_get = function(req, res, next) {
    res.render('registration');
}

exports.registration_post = function(req, res, next) {
    async.parallel({
        users: function(callback) {
            User.find({ 'login':req.body.registr_login }).exec(callback);
        }
    }, function(err, result) {
        if(err) return next(err);

        if(result.users.length > 0) {
            res.render('registration', {title: 'This login is busy', user: result.users});
            return;
        }

        const user = new User({
            login: req.body.registr_login,
            password: req.body.registr_password,
            admin: false,
        });

        user.save(function(err) {
            if(err) return next(err);
            res.redirect(user.url);
        })

    })
}

exports.login_get = function(req, res, next) {
    res.render('login');
}

exports.login_post = function(req, res, next) {
    async.parallel({
        users: function(callback) {
            User.find({'login': req.body.registr_login}).exec(callback);
        },
    }, function(err, result) {
        if(err) return next(err);
        
        if(result.users.length == 0) {
            res.render('login', {title: 'Такого пользователя не существует', user: 1});
        } else if (result.users[0].password != req.body.registr_password) {
            console.log(result.users[0].login);
            res.render('login', {title: 'Неправильным пароль', user:result.users[0]});
        } else {
            res.redirect(result.users[0].url);
        }
    })
}