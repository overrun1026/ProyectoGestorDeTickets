
import { getDashboardStats } from "../services/dashboard.service.js";
import { listTickets } from "../services/tickets.service.js";
import { formatDate, escapeHtml } from "../utils/format-date.js";
import { renderLoader } from "../components/loader.js";

const statusLabels = {
  open: "Abiertos",
  in_progress: "En progreso",
  resolved: "Resueltos",
  closed: "Cerrados",
};

export async function renderDashboard(container) {
  container.replaceChildren(renderLoader("Cargando estadísticas..."));

  try {
    const [statsResponse, ticketsResponse] = await Promise.all([
      getDashboardStats(),
      listTickets({ page: 1, limit: 5 }),
    ]);

    const stats = statsResponse.stats || {};
    const tickets = Array.isArray(ticketsResponse.data)
      ? ticketsResponse.data
      : [];

    const total = Number(stats.total || 0);

    const statCard = (label, value, className) => `
      <article class="stat-card ${className}">
        <span class="stat-label">${label}</span>
        <strong class="stat-value">${Number(value || 0)}</strong>
      </article>
    `;

    container.innerHTML = `
      <div class="page-heading">
        <h1>Resumen general</h1>
        <p>Consulta el estado de las solicitudes de soporte.</p>
      </div>

      <section class="stats-grid">
        ${statCard("Total de tickets", stats.total, "total")}
        ${statCard("Abiertos", stats.open, "open")}
        ${statCard("En progreso", stats.in_progress, "progress")}
        ${statCard("Resueltos", stats.resolved, "resolved")}
      </section>

      <section class="dashboard-grid">
        <article class="card">
          <h2 class="card-title">Estado de los tickets</h2>
          <p class="card-subtitle">Distribución actual</p>

          <div class="stat-summary">
            ${Object.entries(statusLabels).map(([key, label], index) => {
              const value = Number(stats[key] || 0);
              const percentage = total > 0
                ? Math.min(100, (value / total) * 100)
                : 0;
              const colors = ["", "lavender", "teal", "amber"];

              return `
                <div class="stat-row">
                  <span>${label}</span>
                  <div class="progress-track">
                    <div class="progress-fill ${colors[index]}"
                      style="width:${percentage}%"></div>
                  </div>
                  <strong>${value}</strong>
                </div>
              `;
            }).join("")}
          </div>
        </article>

        <article class="card">
          <h2 class="card-title">Acciones rápidas</h2>
          <p class="card-subtitle">Accede a las funciones más utilizadas.</p>
          <div style="display:grid;gap:12px;margin-top:20px">
            <a class="button button-primary" href="#ticket-create">＋ Crear ticket</a>
            <a class="button button-secondary" href="#tickets">Consultar tickets</a>
            <a class="button button-secondary" href="#notifications">Ver notificaciones</a>
          </div>
        </article>
      </section>

      <article class="card" style="margin-top:22px">
        <div class="content-toolbar">
          <div>
            <h2 class="card-title">Tickets recientes</h2>
            <p class="card-subtitle">Últimas solicitudes disponibles para tu cuenta.</p>
          </div>
          <a class="button button-secondary" href="#tickets">Ver todos</a>
        </div>

        ${tickets.length ? `
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr><th>Ticket</th><th>Prioridad</th><th>Estado</th><th>Creación</th></tr>
              </thead>
              <tbody>
                ${tickets.map(ticket => `
                  <tr>
                    <td class="ticket-title-cell">
                      <a class="table-link" href="#ticket/${encodeURIComponent(ticket.id)}">
                        ${escapeHtml(ticket.title)}
                      </a>
                      <span>#${escapeHtml(ticket.id)}</span>
                    </td>
                    <td><span class="badge badge-${escapeHtml(ticket.priority)}">${escapeHtml(ticket.priority)}</span></td>
                    <td><span class="badge badge-${escapeHtml(ticket.status)}">${escapeHtml(ticket.status)}</span></td>
                    <td>${escapeHtml(formatDate(ticket.created_at))}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : `<div class="empty-state">Todavía no hay tickets para mostrar.</div>`}
      </article>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="page-heading"><h1>Resumen general</h1></div>
      <div class="error-message">${escapeHtml(error.message)}</div>
      <button class="button button-secondary" data-action="reload-page">Reintentar</button>
    `;
  }
}
