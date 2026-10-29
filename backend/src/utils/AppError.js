
/*
 * Este archivo define una clase de error para representar fallos esperados
 * de la aplicación junto con el código HTTP que debe devolverse al cliente.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = AppError;
