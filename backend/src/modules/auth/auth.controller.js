
/*
 * Este archivo recibe las solicitudes de registro e inicio de sesión y
 * devuelve el resultado de las operaciones del servicio de autenticación.
 */
const asyncHandler = require('../../utils/asyncHandler');
const authService = require('./auth.service');

exports.register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    message: 'Cuenta creada correctamente',
    user
  });
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

exports.logout = (req, res) => {
  // El token JWT es independiente del servidor. El cliente debe descartarlo.
  res.json({
    message: 'Sesión finalizada. Elimina el token almacenado en el cliente.'
  });
};

exports.me = asyncHandler(async (req, res) => {
  const usersRepository = require('../users/users.repository');
  const user = await usersRepository.findById(req.user.id);

  if (!user || !user.is_active) {
    const AppError = require('../../utils/AppError');
    throw new AppError('La cuenta no está disponible', 401);
  }

  res.json({ user: authService.publicUser(user) });
});
