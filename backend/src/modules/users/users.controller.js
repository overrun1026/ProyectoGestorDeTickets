
/*
 * Este archivo controla las respuestas HTTP para consultar usuarios,
 * listar cuentas y modificar perfiles mediante el servicio de usuarios.
 */
const asyncHandler = require('../../utils/asyncHandler');
const getPagination = require('../../utils/pagination');
const service = require('./users.service');

exports.getById = asyncHandler(async (req, res) => {
  res.json({ user: await service.getById(req.params.id) });
});

exports.list = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const users = await service.list(pagination);

  res.json({
    data: users,
    pagination: { page: pagination.page, limit: pagination.limit }
  });
});

exports.update = asyncHandler(async (req, res) => {
  const user = await service.update(req.params.id, req.body, req.user.id);
  res.json({ message: 'Usuario actualizado', user });
});
