
/*
 * Este archivo verifica el token JWT de cada solicitud protegida y coloca
 * la identidad del usuario autenticado en req.user.
 */
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');

module.exports = function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Se requiere autenticación', 401));
  }

  const token = header.slice(7);

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    next(new AppError('Token inválido o expirado', 401));
  }
};
