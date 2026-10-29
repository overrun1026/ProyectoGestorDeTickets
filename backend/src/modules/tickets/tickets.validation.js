
/*
 * Este archivo valida los campos de los tickets, incluidos el título,
 * la descripción, la categoría, la prioridad y el estado.
 */
const priorities = ['low', 'medium', 'high', 'critical'];
const statuses = ['open', 'in_progress', 'resolved', 'closed'];

function validateCreate(req) {
  const { title, description, categoryId, priority } = req.body || {};
  const errors = [];

  if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 200) {
    errors.push('El título debe tener entre 3 y 200 caracteres');
  }

  if (typeof description !== 'string' ||
      description.trim().length < 5 || description.trim().length > 10000) {
    errors.push('La descripción debe tener entre 5 y 10000 caracteres');
  }

  if (categoryId !== undefined &&
      (!Number.isInteger(categoryId) || categoryId <= 0)) {
    errors.push('categoryId debe ser un entero positivo');
  }

  if (priority !== undefined && !priorities.includes(priority)) {
    errors.push('La prioridad no es válida');
  }

  return errors;
}

function validateUpdate(req) {
  const { title, description, priority, status, assignedTo, categoryId } = req.body || {};
  const errors = [];

  if (title !== undefined &&
      (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 200)) {
    errors.push('El título debe tener entre 3 y 200 caracteres');
  }

  if (description !== undefined &&
      (typeof description !== 'string' ||
       description.trim().length < 5 || description.trim().length > 10000)) {
    errors.push('La descripción debe tener entre 5 y 10000 caracteres');
  }

  if (priority !== undefined && !priorities.includes(priority)) {
    errors.push('La prioridad no es válida');
  }

  if (status !== undefined && !statuses.includes(status)) {
    errors.push('El estado no es válido');
  }

  if (assignedTo !== undefined &&
      assignedTo !== null &&
      (!Number.isInteger(assignedTo) || assignedTo <= 0)) {
    errors.push('assignedTo debe ser un entero positivo o null');
  }

  if (categoryId !== undefined &&
      (!Number.isInteger(categoryId) || categoryId <= 0)) {
    errors.push('categoryId debe ser un entero positivo');
  }

  if (![title, description, priority, status, assignedTo, categoryId]
      .some(value => value !== undefined)) {
    errors.push('Debes enviar al menos un campo para actualizar');
  }

  return errors;
}

module.exports = { validateCreate, validateUpdate };
