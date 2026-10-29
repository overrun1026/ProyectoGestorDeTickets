
/*
 * Este archivo centraliza los errores de Express y devuelve mensajes
 * controlados al cliente sin revelar detalles internos en producción.
 */
const env = require('../config/env');

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let status = err.statusCode || 500;
  let message = status === 500
    ? 'Error interno del servidor'
    : err.message;

  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'El cuerpo de la solicitud contiene JSON inválido';
  }

  if (err.code === '23505') {
    status = 409;
    message = 'Ya existe un registro con esos datos';
  }

  if (err.code === '23503') {
    status = 400;
    message = 'La referencia a otro registro no es válida';
  }

  if (err.code === '23514' || err.code === '22P02') {
    status = 400;
    message = 'Los datos enviados no son válidos';
  }

  if (status >= 500) {
    console.error(err);
  }

  const response = { message };

  if (env.nodeEnv !== 'production' && err.statusCode !== 500) {
    response.errorType = err.name;
  }

  res.status(status).json(response);
};
