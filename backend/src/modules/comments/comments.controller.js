
/*
 * Este archivo recibe las solicitudes de comentarios y devuelve los mensajes
 * de una conversación o confirma la creación de un nuevo comentario.
 */
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./comments.service');

exports.list = asyncHandler(async (req, res) => {
  const comments = await service.list(req.params.ticketId, req.user);
  res.json({ data: comments });
});

exports.create = asyncHandler(async (req, res) => {
  const comment = await service.create(req.params.ticketId, req.body, req.user);
  res.status(201).json({ message: 'Comentario creado', comment });
});
