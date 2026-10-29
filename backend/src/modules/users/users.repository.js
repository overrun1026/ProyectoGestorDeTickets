
/*
 * Este archivo contiene las consultas a PostgreSQL relacionadas con
 * los usuarios: búsqueda, creación, listado y actualización.
 */
const db = require('../../config/database');

async function findByEmail(email) {
  const result = await db.query(
    `SELECT id, name, email, password_hash, role, is_active, created_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email]
  );

  return result.rows[0] || null;
}

async function findById(id) {
  const result = await db.query(
    `SELECT id, name, email, password_hash, role, is_active, created_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id]
  );

  return result.rows[0] || null;
}

async function create({ name, email, passwordHash, role }) {
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, password_hash, role, is_active, created_at`,
    [name, email, passwordHash, role]
  );

  return result.rows[0];
}

async function list({ page = 1, limit = 10 } = {}) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safeLimit = Math.min(
    100,
    Math.max(1, Number.parseInt(limit, 10) || 10)
  );
  const offset = (safePage - 1) * safeLimit;

  const result = await db.query(
    `SELECT id, name, email, role, is_active, created_at
     FROM users
     ORDER BY id DESC
     LIMIT $1 OFFSET $2`,
    [safeLimit, offset]
  );

  return result.rows;
}

async function update(id, { name, role, isActive }) {
  const result = await db.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         role = COALESCE($2, role),
         is_active = COALESCE($3, is_active),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING id, name, email, role, is_active, created_at`,
    [name ?? null, role ?? null, isActive ?? null, id]
  );

  return result.rows[0] || null;
}

module.exports = {
  findByEmail,
  findById,
  create,
  list,
  update
};
