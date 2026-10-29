
/*
 * Este archivo registra los endpoints de registro, inicio y cierre de sesión
 * y consulta del usuario autenticado.
 */
const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');
const authenticate = require('../../middlewares/authenticate');
const validateRequest = require('../../middlewares/validateRequest');
const validation = require('./auth.validation');

router.post('/register', validateRequest(validation.validateRegister), controller.register);
router.post('/login', validateRequest(validation.validateLogin), controller.login);
router.post('/logout', authenticate, controller.logout);
router.get('/me', authenticate, controller.me);

module.exports = router;
