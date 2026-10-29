
/*
 * Este archivo define los endpoints de comentarios asociados a un ticket
 * y aplica autenticación y validación del contenido enviado.
 */
const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticate = require('../../middlewares/authenticate');
const validateRequest = require('../../middlewares/validateRequest');
const controller = require('./comments.controller');

function validateComment(req) {
  const { body, isInternal } = req.body || {};
  const errors = [];

  if (typeof body !== 'string' || body.trim().length < 1 || body.trim().length > 5000) {
    errors.push('El comentario debe tener entre 1 y 5000 caracteres');
  }

  if (isInternal !== undefined && typeof isInternal !== 'boolean') {
    errors.push('isInternal debe ser booleano');
  }

  return errors;
}

router.use(authenticate);
router.get('/', controller.list);
router.post('/', validateRequest(validateComment), controller.create);

module.exports = router;
