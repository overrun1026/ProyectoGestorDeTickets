
/*
 * Este archivo configura Express, habilita el procesamiento de JSON y
 * registra las rutas, los controles de seguridad y el manejo de errores.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');

const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const ticketsRoutes = require('./modules/tickets/tickets.routes');
const commentsRoutes = require('./modules/comments/comments.routes');
const categoriesRoutes = require('./modules/categories/categories.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const notificationsRoutes = require('./modules/notifications/notifications.routes');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json({ limit: '1mb' }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));

app.get('/', (req, res) => {
  res.json({
    message: 'HelpDesk API funcionando',
    health: '/health',
    documentation: 'Consulta los endpoints disponibles en el proyecto'
  });
});


app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'HelpDesk API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/tickets/:ticketId/comments', commentsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
