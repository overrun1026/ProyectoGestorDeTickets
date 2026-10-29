
/*
 * Este archivo inicia el servidor HTTP, verifica la conexión con PostgreSQL
 * y cierra el servidor y el pool de conexiones cuando termina el proceso.
 */
const app = require('./app');
const { query, closePool } = require('./config/database');
const env = require('./config/env');

let server;

async function start() {
  await query('SELECT 1');

  server = app.listen(env.port, () => {
    console.log(`HelpDesk API disponible en http://localhost:${env.port}`);
  });
}

async function shutdown() {
  console.log('Cerrando HelpDesk API...');

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await closePool();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start().catch(async (error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  await closePool();
  process.exit(1);
});
