
/*
 * Este archivo restringe el acceso a rutas según los roles permitidos,
 * por ejemplo, reservando la administración a los usuarios administradores.
 */
const AppError = require('../utils/AppError');

module.exports = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('No tienes permiso para esta operación', 403));
  }

  next();
};
