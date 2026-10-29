
/*
 * Este archivo centraliza la configuración del entorno y verifica que las
 * variables obligatorias estén definidas antes de iniciar el servidor.
 */
require('dotenv').config();

const required = [
  'DATABASE_URL',
  'JWT_SECRET'
];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
}

module.exports = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080'
};
