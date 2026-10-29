
/*
 * Este archivo verifica que la API proteja el listado de tickets y
 * solicite autenticación antes de devolver información privada.
 */
process.env.DATABASE_URL ||= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET ||= 'test_secret_for_local_automated_tests_only_123456';
process.env.FRONTEND_URL ||= 'http://localhost:8080';

const request = require('supertest');
const app = require('../src/app');

describe('Tickets', () => {
  test('requiere autenticación para listar tickets', async () => {
    const response = await request(app).get('/api/tickets');

    expect(response.status).toBe(401);
  });
});
