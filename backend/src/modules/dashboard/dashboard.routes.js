
/*
 * Este archivo define las rutas protegidas para consultar las estadísticas
 * generales o personales del sistema de tickets.
 */
const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate');
const controller = require('./dashboard.controller');

router.get('/stats', authenticate, controller.stats);

module.exports = router;
