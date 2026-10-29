
/*
 * Este archivo procesa las solicitudes para listar las notificaciones
 * del usuario autenticado y actualizar su estado de lectura.
 */
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./notifications.service');

exports.list = asyncHandler(async (req, res) => {
  res.json({ data: await service.list(req.user.id) });
});

exports.markRead = asyncHandler(async (req, res) => {
  const notification = await service.markRead(req.params.id, req.user.id);
  res.json({ message: 'Notificación marcada como leída', notification });
});
