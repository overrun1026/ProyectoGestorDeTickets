
const db = require('../../config/database');

async function create({ userId, ticketId, type, message }) {
  const result = await db.query(
    `INSERT INTO notifications (user_id, ticket_id, type, message)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, ticket_id, type, message, is_read, created_at`,
    [userId, ticketId ?? null, type, message]
  );

  return result.rows[0];
}

module.exports = { create };
