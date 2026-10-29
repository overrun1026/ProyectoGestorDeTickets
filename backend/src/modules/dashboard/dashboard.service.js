
/*
 * Este archivo obtiene los totales de tickets agrupados por estado y
 * calcula estadísticas para el panel de control de HelpDesk.
 */
const repository = require('../tickets/tickets.repository');

async function getStats(user) {
  const rows = await repository.countByStatus(
    user.id,
    user.role === 'admin'
  );

  const stats = {
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0
  };

  for (const row of rows) {
    stats[row.status] = row.total;
    stats.total += row.total;
  }

  return stats;
}

module.exports = { getStats };
