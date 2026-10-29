
/*
 * Este archivo envuelve controladores asíncronos para propagar automáticamente
 * sus errores al middleware global de manejo de errores.
 */
module.exports = function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
