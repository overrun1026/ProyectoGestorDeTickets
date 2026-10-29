
/*
 * Este archivo contiene las consultas SQL para crear comentarios y listar
 * la conversación asociada a un ticket.
 */
const db = require('../../config/database');

async function listByTicket(ticketId) {
  const result = await db.query(
    `SELECT c.id, c.ticket_id, c.user_id, c.body, c.is_internal, c.created_at,
            u.name AS author_name
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.ticket_id = $1
     ORDER BY c.created_at ASC`,
    [ticketId]
  );
  return result.rows;
}

async function create({ ticketId, userId, body, isInternal }) {
  const result = await db.query(
    `INSERT INTO comments (ticket_id, user_id, body, is_internal)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [ticketId, userId, body, isInternal]
  );
  return result.rows[0];
}

module.exports = { listByTicket, create };
