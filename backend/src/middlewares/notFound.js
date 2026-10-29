
/*
 * Este archivo responde con HTTP 404 cuando el cliente solicita un endpoint
 * que no existe en la API.
 */
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
};
