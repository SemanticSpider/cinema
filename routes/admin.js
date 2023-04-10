var express = require('express');

var router = express.Router();

var admin_controller = require('../controller/adminController');

router.get('/:id', admin_controller.seans_list);
router.get('/:id/seans/:id_seans', admin_controller.seans_detail);
router.get('/:id/create/seans', admin_controller.create_seans_get);
router.post('/:id/create/seans', admin_controller.create_seans_post);
router.get('/:id/create/film', admin_controller.create_film_get);
router.post('/:id/create/film', admin_controller.create_film_post);
router.get('/:id/:id_seans/update', admin_controller.update_get);
router.post('/:id/:id_seans/update', admin_controller.update_post);
router.get('/:id/:id_seans/delete', admin_controller.delete_get);
router.post('/:id/:id_seans/delete', admin_controller.delete_post);

module.exports = router;