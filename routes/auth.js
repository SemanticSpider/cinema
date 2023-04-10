var express = require('express');
var auth_controller = require('../controller/authController');

var router = express.Router();

router.get('/registration', auth_controller.registration_get);
router.post('/registration', auth_controller.registration_post)

router.get('/login', auth_controller.login_get);
router.post('/login', auth_controller.login_post);

module.exports = router;