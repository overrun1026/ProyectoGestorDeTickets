
/*
 * Este archivo aplica las reglas de negocio para crear y modificar
 * categorías y comprueba que los registros existan.
 */
const AppError = require('../../utils/AppError');
const repository = require('./categories.repository');

async function list() {
  return repository.list();
}

async function create(data) {
  return repository.create(data.name.trim(), data.description?.trim());
}

async function update(id, data) {
  const category = await repository.findById(id);

  if (!category) {
    throw new AppError('Categoría no encontrada', 404);
  }

  return repository.update(id, {
    name: data.name?.trim(),
    description: data.description?.trim(),
    isActive: data.isActive
  });
}

module.exports = { list, create, update };
