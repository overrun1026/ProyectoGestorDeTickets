
/*
 * Este archivo comprueba los permisos sobre un ticket antes de permitir
 * leer o añadir comentarios a su conversación.
 */
const AppError = require('../../utils/AppError');
const ticketsRepository = require('../tickets/tickets.repository');
const commentsRepository = require('./comments.repository');

async function checkAccess(ticketId, user) {
  const ticket = await ticketsRepository.findById(ticketId);

  if (!ticket) throw new AppError('Ticket no encontrado', 404);

  if (user.role !== 'admin' && Number(ticket.created_by) !== Number(user.id)) {
    throw new AppError('No tienes permiso para acceder a esta conversación', 403);
  }

  return ticket;
}

async function list(ticketId, user) {
  await checkAccess(ticketId, user);
  const comments = await commentsRepository.listByTicket(ticketId);

  // Las notas internas solo son visibles para administradores.
  return user.role === 'admin'
    ? comments
    : comments.filter(comment => !comment.is_internal);
}

async function create(ticketId, body, user) {
  const ticket = await checkAccess(ticketId, user);

  if (['closed', 'resolved'].includes(ticket.status)) {
    throw new AppError('No se pueden añadir comentarios a un ticket resuelto o cerrado', 400);
  }

  const isInternal = user.role === 'admin' && body.isInternal === true;

  return commentsRepository.create({
    ticketId,
    userId: user.id,
    body: body.body.trim(),
    isInternal
  });
}

module.exports = { list, create };
