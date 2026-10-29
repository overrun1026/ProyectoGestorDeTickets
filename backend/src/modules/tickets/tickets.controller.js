
/*
 * Este archivo recibe las solicitudes HTTP de tickets, invoca los servicios
 * correspondientes y devuelve los datos y mensajes al cliente.
 */
const asyncHandler = require('../../utils/asyncHandler');
const getPagination = require('../../utils/pagination');
const service = require('./tickets.service');

exports.create = asyncHandler(async (req, res) => {
  const ticket = await service.create(req.body, req.user);
  res.status(201).json({ message: 'Ticket creado', ticket });
});

exports.getById = asyncHandler(async (req, res) => {
  const ticket = await service.getById(req.params.ticketId, req.user);
  res.json({ ticket });
});

exports.list = asyncHandler(async (req, res) => {
  const result = await service.list(req.query, req.user, getPagination(req.query));
  res.json(result);
});

exports.update = asyncHandler(async (req, res) => {
  const ticket = await service.update(req.params.ticketId, req.body, req.user);
  res.json({ message: 'Ticket actualizado', ticket });
});

exports.remove = asyncHandler(async (req, res) => {
  const ticket = await service.remove(req.params.ticketId, req.user);
  res.json({ message: 'Ticket eliminado', ticket });
});

/*
 * Este controlador devuelve el historial de auditoría asociado a un ticket.
 */
exports.history = asyncHandler(async (req, res) => {
  const service = require('../audit/audit.service');
  const history = await service.listByTicket(req.params.ticketId, req.user);
  res.json({ data: history });
});