
/*
 * Este archivo contiene las consultas SQL para listar, buscar, crear y
 * modificar las categorías utilizadas para clasificar tickets.
 */
const db = require('../../config/database');

async function findById(id) {
  const result = await db.query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function list() {
  const result = await db.query(
    'SELECT * FROM categories ORDER BY name'
  );
  return result.rows;
}

async function create(name, description) {
  const result = await db.query(
    `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description || null]
  );
  return result.rows[0];
}

async function update(id, { name, description, isActive }) {
  const result = await db.query(
    `UPDATE categories
     SET name = COALESCE($2, name),
         description = COALESCE($3, description),
         is_active = COALESCE($4, is_active)
     WHERE id = $1
     RETURNING *`,
    [id, name ?? null, description ?? null, isActive ?? null]
  );
  return result.rows[0] || null;
}

module.exports = { findById, list, create, update };
