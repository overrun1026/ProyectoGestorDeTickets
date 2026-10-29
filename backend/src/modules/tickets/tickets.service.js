
/*
 * Este archivo contiene las reglas de negocio de los tickets y verifica
 * la propiedad del ticket, las asignaciones y las transiciones de estado.
 */
const AppError = require('../../utils/AppError');
const repository = require('./tickets.repository');
const usersRepository = require('../users/users.repository');
const categoriesRepository = require('../categories/categories.repository');
const auditRepository = require('../audit/audit.repository');
const notificationsService = require('../notifications/notifications.service');

async function create(data, user) {
  if (data.categoryId) {
    const category = await categoriesRepository.findById(data.categoryId);
    if (!category || !category.is_active) {
      throw new AppError('La categoría no existe o está inactiva', 400);
    }
  }

  const ticket = await repository.create({
    title: data.title.trim(),
    description: data.description.trim(),
    priority: data.priority || 'medium',
    categoryId: data.categoryId || null,
    createdBy: user.id
  });

  await auditRepository.record({
    ticketId: ticket.id,
    userId: user.id,
    action: 'ticket.created',
    details: { title: ticket.title }
  });

  return ticket;
}

async function getById(id, user) {
  const ticket = await repository.findById(id);

  if (!ticket) throw new AppError('Ticket no encontrado', 404);

  if (user.role !== 'admin' && Number(ticket.created_by) !== Number(user.id)) {
    throw new AppError('No tienes permiso para consultar este ticket', 403);
  }

  return ticket;
}

async function list(query, user, pagination) {
  const allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];
  const allowedPriorities = ['low', 'medium', 'high', 'critical'];

  if (query.status && !allowedStatuses.includes(query.status)) {
    throw new AppError('Filtro de estado no válido', 400);
  }

  if (query.priority && !allowedPriorities.includes(query.priority)) {
    throw new AppError('Filtro de prioridad no válido', 400);
  }

  const categoryId = query.categoryId ? Number(query.categoryId) : undefined;
  const assignedTo = query.assignedTo ? Number(query.assignedTo) : undefined;

  if (categoryId !== undefined && (!Number.isInteger(categoryId) || categoryId <= 0)) {
    throw new AppError('categoryId no es válido', 400);
  }

  if (assignedTo !== undefined && (!Number.isInteger(assignedTo) || assignedTo <= 0)) {
    throw new AppError('assignedTo no es válido', 400);
  }

  const result = await repository.list({
    ...pagination,
    filters: { ...query, categoryId, assignedTo },
    userId: user.id,
    isAdmin: user.role === 'admin'
  });

  return {
    ...result,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(result.total / pagination.limit)
  };
}

async function update(id, data, user) {
  const ticket = await repository.findById(id);

  if (!ticket) throw new AppError('Ticket no encontrado', 404);

  const isAdmin = user.role === 'admin';
  const isOwner = Number(ticket.created_by) === Number(user.id);

  if (!isAdmin && !isOwner) {
    throw new AppError('No tienes permiso para modificar este ticket', 403);
  }

  if (!isAdmin && (data.status !== undefined ||
      data.priority !== undefined ||
      data.assignedTo !== undefined ||
      data.categoryId !== undefined)) {
    throw new AppError('Solo un administrador puede cambiar estado, prioridad, asignación o categoría', 403);
  }

  if (!isAdmin && ['resolved', 'closed'].includes(ticket.status)) {
    throw new AppError('No puedes modificar un ticket resuelto o cerrado', 400);
  }

  if (data.status !== undefined) {
    const transitions = {
      open: ['in_progress', 'closed'],
      in_progress: ['open', 'resolved'],
      resolved: ['in_progress', 'closed'],
      closed: ['open']
    };

    if (!transitions[ticket.status]?.includes(data.status)) {
      throw new AppError(`No se permite cambiar de ${ticket.status} a ${data.status}`, 400);
    }
  }

  if (data.categoryId !== undefined) {
    const category = await categoriesRepository.findById(data.categoryId);
    if (!category || !category.is_active) {
      throw new AppError('La categoría no existe o está inactiva', 400);
    }
  }

  if (data.assignedTo !== undefined && data.assignedTo !== null) {
    const assignee = await usersRepository.findById(data.assignedTo);

    if (!assignee || !assignee.is_active) {
      throw new AppError('El responsable no existe o está inactivo', 400);
    }
  }

  
const updated = await repository.update(id, data);

await auditRepository.record({
  ticketId: Number(id),
  userId: user.id,
  action: 'ticket.updated',
  details: { changes: data }
});

// Notificar al creador cuando cambia el estado.
if (data.status !== undefined && data.status !== ticket.status) {
  await notificationsService.create({
    userId: Number(ticket.created_by),
    ticketId: Number(id),
    type: 'ticket.status_changed',
    message: `El estado de tu ticket "${ticket.title}" cambió de ${ticket.status} a ${data.status}.`
  });
}

// Notificar al nuevo responsable cuando se le asigna el ticket.
if (
  data.assignedTo !== undefined &&
  data.assignedTo !== null &&
  Number(data.assignedTo) !== Number(ticket.assigned_to)
) {
  await notificationsService.create({
    userId: Number(data.assignedTo),
    ticketId: Number(id),
    type: 'ticket.assigned',
    message: `Se te ha asignado el ticket "${ticket.title}".`
  });
}

return updated;

}

async function remove(id, user) {
  const ticket = await repository.findById(id);

  if (!ticket) throw new AppError('Ticket no encontrado', 404);

  if (user.role !== 'admin') {
    throw new AppError('Solo un administrador puede eliminar tickets', 403);
  }

  await auditRepository.record({
    ticketId: null,
    userId: user.id,
    action: 'ticket.deleted',
    details: { ticketId: Number(id), title: ticket.title }
  });

  return repository.remove(id);
}

module.exports = { create, getById, list, update, remove };
