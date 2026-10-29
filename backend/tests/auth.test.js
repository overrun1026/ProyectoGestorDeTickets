
/*
 * Este archivo prueba las validaciones del registro y comprueba que la API
 * rechace solicitudes de autenticación con datos incompletos.
 */
process.env.DATABASE_URL ||= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET ||= 'test_secret_for_local_automated_tests_only_123456';
process.env.FRONTEND_URL ||= 'http://localhost:8080';

const request = require('supertest');
const app = require('../src/app');

describe('Autenticación', () => {
  test('rechaza el registro cuando los datos son inválidos', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ name: '', email: 'correo-invalido', password: '123' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  test('rechaza el inicio de sesión sin credenciales', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });
});
