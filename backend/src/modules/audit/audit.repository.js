
/*
 * Este archivo almacena las acciones importantes del sistema para conservar
 * un registro de quién realizó una operación y cuándo ocurrió.
 */
const db = require('../../config/database');

async function record({ ticketId, userId, action, details = {} }) {
  const result = await db.query(
    `INSERT INTO ticket_history (ticket_id, user_id, action, details)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [ticketId, userId, action, JSON.stringify(details)]
  );
  return result.rows[0];
}

async function listByTicket(ticketId) {
  const result = await db.query(
    `SELECT h.*, u.name AS user_name
     FROM ticket_history h
     LEFT JOIN users u ON u.id = h.user_id
     WHERE h.ticket_id = $1
     ORDER BY h.created_at DESC`,
    [ticketId]
  );
  return result.rows;
}

module.exports = { record, listByTicket };
