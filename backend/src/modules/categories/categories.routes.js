
/*
 * Este archivo registra las rutas de categorías y restringe las operaciones
 * de creación y modificación a usuarios administradores.
 */
const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validateRequest');
const controller = require('./categories.controller');
const validation = require('./categories.validation');

router.get('/', authenticate, controller.list);
router.post('/', authenticate, authorize('admin'), validateRequest(validation.validateCreate), controller.create);
router.patch('/:id', authenticate, authorize('admin'), validateRequest(validation.validateUpdate), controller.update);

module.exports = router;
