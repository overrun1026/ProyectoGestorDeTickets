
/*
 * Este archivo valida los nombres y descripciones de las categorías
 * antes de permitir su creación o modificación.
 */
function validateCreate(req) {
  const { name, description } = req.body || {};
  const errors = [];

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
    errors.push('El nombre debe tener entre 2 y 80 caracteres');
  }

  if (description !== undefined &&
      (typeof description !== 'string' || description.length > 500)) {
    errors.push('La descripción no puede superar 500 caracteres');
  }

  return errors;
}

function validateUpdate(req) {
  const { name, description, isActive } = req.body || {};
  const errors = [];

  if (name !== undefined &&
      (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80)) {
    errors.push('El nombre debe tener entre 2 y 80 caracteres');
  }

  if (description !== undefined &&
      (typeof description !== 'string' || description.length > 500)) {
    errors.push('La descripción no puede superar 500 caracteres');
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    errors.push('isActive debe ser booleano');
  }

  if (name === undefined && description === undefined && isActive === undefined) {
    errors.push('Debes enviar al menos un campo para actualizar');
  }

  return errors;
}

module.exports = { validateCreate, validateUpdate };
