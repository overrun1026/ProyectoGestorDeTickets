
/*
 * Este archivo comprueba que las rutas privadas de administración de
 * usuarios no permitan el acceso sin un token de autenticación.
 */
process.env.DATABASE_URL ||= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET ||= 'test_secret_for_local_automated_tests_only_123456';
process.env.FRONTEND_URL ||= 'http://localhost:8080';

const request = require('supertest');
const app = require('../src/app');

describe('Usuarios', () => {
  test('requiere autenticación para listar usuarios', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(401);
  });
});
