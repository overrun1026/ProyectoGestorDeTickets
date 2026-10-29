
/*
 * Este archivo registra las rutas para consultar y administrar usuarios
 * y protege las operaciones administrativas con autenticación y roles.
 */
const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validateRequest');
const controller = require('./users.controller');
const validation = require('./users.validation');

router.use(authenticate);

router.get('/me', (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

router.get('/', authorize('admin'), controller.list);
router.get('/:id', authorize('admin'), controller.getById);
router.patch('/:id', authorize('admin'), validateRequest(validation.validateUpdate), controller.update);

module.exports = router;
