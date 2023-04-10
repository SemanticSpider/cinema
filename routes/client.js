var express = require('express');
var client_controller = require('../controller/clientController');

var router = express.Router();

router.get('/:id', client_controller.profile);
router.get('/:id/ticket', client_controller.ticket_list);
router.get('/:id/seans', client_controller.seans_list);
router.get('/:id/seans/:seans_id', client_controller.seans_detail_get);
router.post('/:id/seans/:seans_id', client_controller.seans_detail_post);
router.get('/:id/film/:film_id', client_controller.film_detail);



module.exports = router;