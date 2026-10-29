
/*
 * Este archivo registra las rutas de notificaciones y requiere que el
 * usuario esté autenticado para acceder a sus propios mensajes.
 */
const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate');
const controller = require('./notifications.controller');

router.use(authenticate);
router.get('/', controller.list);
router.patch('/:id/read', controller.markRead);

module.exports = router;
