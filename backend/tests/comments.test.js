
/*
 * Este archivo comprueba que los comentarios de un ticket no puedan
 * consultarse sin autenticación.
 */
process.env.DATABASE_URL ||= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET ||= 'test_secret_for_local_automated_tests_only_123456';
process.env.FRONTEND_URL ||= 'http://localhost:8080';

const request = require('supertest');
const app = require('../src/app');

describe('Comentarios', () => {
  test('requiere autenticación para consultar comentarios', async () => {
    const response = await request(app)
      .get('/api/tickets/1/comments');

    expect(response.status).toBe(401);
  });
});
