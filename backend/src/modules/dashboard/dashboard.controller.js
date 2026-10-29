
/*
 * Este archivo recibe las solicitudes del dashboard y devuelve las
 * estadísticas calculadas por el servicio.
 */
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./dashboard.service');

exports.stats = asyncHandler(async (req, res) => {
  res.json({ stats: await service.getStats(req.user) });
});
