
/*
 * Este archivo contiene las consultas SQL de tickets, incluyendo filtros,
 * paginación, asignaciones y recuperación de los registros completos.
 */
const db = require('../../config/database');

const selectTicket = `
  SELECT t.*,
         u.name AS creator_name,
         a.name AS assignee_name,
         c.name AS category_name
  FROM tickets t
  JOIN users u ON u.id = t.created_by
  LEFT JOIN users a ON a.id = t.assigned_to
  LEFT JOIN categories c ON c.id = t.category_id
`;

async function findById(id) {
  const result = await db.query(
    `${selectTicket} WHERE t.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function create({ title, description, priority, categoryId, createdBy }) {
  const result = await db.query(
    `INSERT INTO tickets
      (title, description, priority, category_id, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, description, priority, categoryId, createdBy]
  );
  return result.rows[0];
}

async function list({ limit, offset, filters, userId, isAdmin }) {
  const conditions = [];
  const values = [];

  function addCondition(sql, value) {
    values.push(value);
    conditions.push(sql.replace('?', `$${values.length}`));
  }

  if (!isAdmin) {
    addCondition('t.created_by = ?', userId);
  }

  if (filters.status) addCondition('t.status = ?', filters.status);
  if (filters.priority) addCondition('t.priority = ?', filters.priority);
  if (filters.categoryId) addCondition('t.category_id = ?', filters.categoryId);
  if (filters.assignedTo) addCondition('t.assigned_to = ?', filters.assignedTo);

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`(t.title ILIKE $${values.length} OR t.description ILIKE $${values.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(limit);
  const limitParam = `$${values.length}`;

  values.push(offset);
  const offsetParam = `$${values.length}`;

  const result = await db.query(
    `${selectTicket}
     ${where}
     ORDER BY t.created_at DESC
     LIMIT ${limitParam} OFFSET ${offsetParam}`,
    values
  );

  const countResult = await db.query(
    `SELECT COUNT(*)::int AS total FROM tickets t ${where}`,
    values.slice(0, values.length - 2)
  );

  return {
    data: result.rows,
    total: countResult.rows[0].total
  };
}

async function update(id, data) {
  const result = await db.query(
    `UPDATE tickets
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         priority = COALESCE($4, priority),
         status = COALESCE($5, status),
         assigned_to = CASE WHEN $6::boolean THEN $7::integer ELSE assigned_to END,
         category_id = COALESCE($8, category_id),
         updated_at = NOW(),
         resolved_at = CASE
           WHEN $5 = 'resolved' THEN NOW()
           WHEN $5 = 'closed' THEN COALESCE(resolved_at, NOW())
           WHEN $5 IN ('open', 'in_progress') THEN NULL
           ELSE resolved_at
         END
     WHERE id = $1
     RETURNING *`,
    [
      id,
      data.title ?? null,
      data.description ?? null,
      data.priority ?? null,
      data.status ?? null,
      data.assignedTo !== undefined,
      data.assignedTo ?? null,
      data.categoryId ?? null
    ]
  );

  return result.rows[0] || null;
}

async function remove(id) {
  const result = await db.query(
    'DELETE FROM tickets WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0] || null;
}

async function countByStatus(userId, isAdmin) {
  const result = await db.query(
    `SELECT status, COUNT(*)::int AS total
     FROM tickets
     ${isAdmin ? '' : 'WHERE created_by = $1'}
     GROUP BY status`,
    isAdmin ? [] : [userId]
  );
  return result.rows;
}

module.exports = { findById, create, list, update, remove, countByStatus };
