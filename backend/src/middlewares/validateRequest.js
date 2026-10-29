
/*
 * Este archivo ejecuta una función de validación sobre los datos de una
 * solicitud y rechaza las entradas incorrectas con un error HTTP 400.
 */
const AppError = require('../utils/AppError');

module.exports = (validator) => (req, res, next) => {
  const errors = validator(req);

  if (errors.length > 0) {
    return next(new AppError(errors.join('; '), 400));
  }

  next();
};
