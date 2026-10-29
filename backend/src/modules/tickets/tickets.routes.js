
/*
 * Este archivo define los endpoints para crear, listar, consultar,
 * actualizar y eliminar tickets y aplica los controles necesarios.
 */
const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validateRequest');
const controller = require('./tickets.controller');
const validation = require('./tickets.validation');

router.use(authenticate);

router.get('/', controller.list);
router.post('/', validateRequest(validation.validateCreate), controller.create);
// Consulta el historial de cambios de un ticket.
router.get('/:ticketId/history', controller.history);
router.get('/:ticketId', controller.getById);
router.patch('/:ticketId', validateRequest(validation.validateUpdate), controller.update);
router.delete('/:ticketId', authorize('admin'), controller.remove);

module.exports = router;
