
/*
 * Este archivo aplica los permisos para consultar el historial de cambios
 * de un ticket y devuelve sus registros de auditoría.
 */
const AppError = require('../../utils/AppError');
const ticketsRepository = require('../tickets/tickets.repository');
const auditRepository = require('./audit.repository');

async function listByTicket(ticketId, user) {
  const ticket = await ticketsRepository.findById(ticketId);

  if (!ticket) throw new AppError('Ticket no encontrado', 404);

  if (user.role !== 'admin' && Number(ticket.created_by) !== Number(user.id)) {
    throw new AppError('No tienes permiso para consultar este historial', 403);
  }

  return auditRepository.listByTicket(ticketId);
}

module.exports = { listByTicket };
