
import { listTickets } from "../services/tickets.service.js";
import { formatDate, escapeHtml } from "../utils/format-date.js";
import { renderLoader } from "../components/loader.js";

export async function renderTicketsList(container) {
  container.replaceChildren(renderLoader("Cargando tickets..."));

  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const filters = {
    page: params.get("page") || "1",
    limit: "10",
    status: params.get("status") || "",
    priority: params.get("priority") || "",
    search: params.get("search") || "",
  };

  try {
    const result = await listTickets({
      page: filters.page,
      limit: filters.limit,
      status: filters.status,
      priority: filters.priority,
    });

    const tickets = Array.isArray(result.data) ? result.data : [];

    container.innerHTML = `
      <div class="page-heading">
        <h1>Tickets</h1>
        <p>Busca y consulta tus solicitudes de soporte.</p>
      </div>

      <div class="content-toolbar">
        <form id="ticket-filter-form" class="ticket-filters">
          <input name="search" placeholder="Buscar por título..."
            value="${escapeHtml(filters.search)}" aria-label="Buscar tickets" />
          <select name="status" aria-label="Filtrar por estado">
            <option value="">Todos los estados</option>
            ${[
              ["open", "Abierto"],
              ["in_progress", "En progreso"],
              ["resolved", "Resuelto"],
              ["closed", "Cerrado"],
            ].map(([value, label]) =>
              `<option value="${value}" ${filters.status === value ? "selected" : ""}>${label}</option>`
            ).join("")}
          </select>
          <select name="priority" aria-label="Filtrar por prioridad">
            <option value="">Todas las prioridades</option>
            ${["low", "medium", "high", "critical"].map(value =>
              `<option value="${value}" ${filters.priority === value ? "selected" : ""}>${value}</option>`
            ).join("")}
          </select>
          <button class="button button-secondary" type="submit">Filtrar</button>
        </form>

        <a class="button button-primary" href="#ticket-create">＋ Crear ticket</a>
      </div>

      <article class="card">
        ${tickets.length ? `
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ticket</th><th>Estado</th><th>Prioridad</th><th>Creado</th><th></th>
                </tr>
              </thead>
              <tbody>
                ${tickets.map(ticket => `
                  <tr>
                    <td class="ticket-title-cell">
                      <strong>${escapeHtml(ticket.title)}</strong>
                      <span>#${escapeHtml(ticket.id)}</span>
                    </td>
                    <td><span class="badge badge-${escapeHtml(ticket.status)}">${escapeHtml(ticket.status)}</span></td>
                    <td><span class="badge badge-${escapeHtml(ticket.priority)}">${escapeHtml(ticket.priority)}</span></td>
                    <td>${escapeHtml(formatDate(ticket.created_at))}</td>
                    <td><a class="table-link" href="#ticket/${encodeURIComponent(ticket.id)}">Ver detalle →</a></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
          <div class="pagination">
            <span>Total: ${Number(result.total || tickets.length)} tickets</span>
            <span>Página ${Number(result.page || 1)} de ${Number(result.totalPages || 1)}</span>
          </div>
        ` : `<div class="empty-state">No se encontraron tickets con esos filtros.</div>`}
      </article>
    `;
  } catch (error) {
    container.innerHTML = `<div class="error-message">${escapeHtml(error.message)}</div>`;
  }
}
