
/*
 * Este archivo recibe las solicitudes de categorías y devuelve las
 * respuestas correspondientes después de ejecutar los servicios.
 */
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./categories.service');

exports.list = asyncHandler(async (req, res) => {
  res.json({ data: await service.list() });
});

exports.create = asyncHandler(async (req, res) => {
  const category = await service.create(req.body);
  res.status(201).json({ message: 'Categoría creada', category });
});

exports.update = asyncHandler(async (req, res) => {
  const category = await service.update(req.params.id, req.body);
  res.json({ message: 'Categoría actualizada', category });
});
