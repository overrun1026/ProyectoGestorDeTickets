
/*
 * Este archivo aplica las reglas de negocio de usuarios y evita que un
 * administrador se desactive accidentalmente a sí mismo.
 */
const AppError = require('../../utils/AppError');
const repository = require('./users.repository');

async function getById(id) {
  const user = await repository.findById(id);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  return user;
}

async function list(pagination) {
  return repository.list(pagination);
}

async function update(id, data, currentUserId) {
  const target = await repository.findById(id);

  if (!target) {
    throw new AppError('Usuario no encontrado', 404);
  }

  if (Number(id) === Number(currentUserId) &&
      (data.role === 'user' || data.isActive === false)) {
    throw new AppError('No puedes quitarte tus propios permisos ni desactivar tu cuenta', 400);
  }

  return repository.update(id, {
    name: data.name?.trim(),
    role: data.role,
    isActive: data.isActive
  });
}

module.exports = { getById, list, update };
