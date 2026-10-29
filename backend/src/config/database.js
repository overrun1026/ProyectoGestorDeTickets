
/*
 * Este archivo configura el pool de conexiones de PostgreSQL y permite
 * ejecutar consultas parametrizadas desde los repositorios del backend.
 */
const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: true }
    : false
});

pool.on('error', (error) => {
  console.error('Error inesperado en el pool de PostgreSQL:', error.message);
});

async function query(text, params = []) {
  return pool.query(text, params);
}

async function closePool() {
  await pool.end();
}

module.exports = {
  pool,
  query,
  closePool
};
