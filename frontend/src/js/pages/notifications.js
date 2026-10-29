
import {
  listNotifications,
  markNotificationRead,
} from "../services/notifications.service.js";
import { formatDate, escapeHtml } from "../utils/format-date.js";
import { renderLoader } from "../components/loader.js";

export async function renderNotifications(container) {
  container.replaceChildren(renderLoader("Cargando notificaciones..."));

  try {
    const result = await listNotifications();
    const items = Array.isArray(result.data) ? result.data : [];
    const unread = items.filter(item => !item.is_read).length;

    container.innerHTML = `
      <div class="page-heading">
        <h1>Notificaciones</h1>
        <p>Tienes ${unread} notificación${unread === 1 ? "" : "es"} sin leer.</p>
      </div>

      <section class="card">
        ${items.length ? items.map(item => `
          <article class="comment" style="margin-bottom:12px">
            <div class="comment-meta">
              <strong>${escapeHtml(item.type)}</strong>
              <span>${escapeHtml(formatDate(item.created_at))}</span>
            </div>
            <p>${escapeHtml(item.message)}</p>
            <div class="toolbar-group">
              ${item.ticket_id ? `<a class="table-link" href="#ticket/${encodeURIComponent(item.ticket_id)}">Ver ticket</a>` : ""}
              ${item.is_read ? `<span class="badge badge-closed">Leída</span>` : `
                <button class="button button-secondary"
                  data-action="mark-notification-read"
                  data-id="${escapeHtml(item.id)}">Marcar como leída</button>
              `}
            </div>
          </article>
        `).join("") : `<div class="empty-state">No tienes notificaciones por ahora.</div>`}
      </section>
    `;
  } catch (error) {
    container.innerHTML = `<div class="error-message">${escapeHtml(error.message)}</div>`;
  }
}

export { markNotificationRead };
