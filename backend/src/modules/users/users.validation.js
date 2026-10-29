
/*
 * Este archivo valida los campos permitidos al modificar perfiles y
 * cuentas de usuario mediante las rutas administrativas.
 */
function validateUpdate(req) {
  const { name, role, isActive } = req.body || {};
  const errors = [];

  if (name !== undefined &&
      (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100)) {
    errors.push('El nombre debe tener entre 2 y 100 caracteres');
  }

  if (role !== undefined && !['user', 'admin'].includes(role)) {
    errors.push('El rol debe ser user o admin');
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    errors.push('isActive debe ser booleano');
  }

  if (name === undefined && role === undefined && isActive === undefined) {
    errors.push('Debes enviar al menos un campo para actualizar');
  }

  return errors;
}

module.exports = { validateUpdate };
