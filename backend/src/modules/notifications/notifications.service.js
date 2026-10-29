
/*
 * Este archivo obtiene las notificaciones de un usuario y marca como leídas
 * únicamente las notificaciones que le pertenecen.
 */
const db = require('../../config/database');
const AppError = require('../../utils/AppError');
const repository = require('./notifications.repository');

async function list(userId) {
  const result = await db.query(
    `SELECT id, type, message, ticket_id, is_read, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 100`,
    [userId]
  );

  return result.rows;
}

async function markRead(id, userId) {
  const result = await db.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId]
  );

  if (!result.rows[0]) {
    throw new AppError('Notificación no encontrada', 404);
  }

  return result.rows[0];
}


async function create({ userId, ticketId, type, message }) {
  return repository.create({
    userId,
    ticketId,
    type,
    message
  });
}

module.exports = { list, markRead, create };
