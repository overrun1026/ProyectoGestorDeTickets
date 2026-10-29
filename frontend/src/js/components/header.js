
import { escapeHtml } from "../utils/format-date.js";

const titles = {
  dashboard: "Resumen general",
  tickets: "Gestión de tickets",
  notifications: "Notificaciones",
  categories: "Categorías de soporte",
  users: "Administración de usuarios",
  profile: "Mi perfil",
};

export function renderHeader(route, user, unreadCount = 0) {
  return `
    <header class="topbar">
      <div>
        <h2 class="topbar-title">${escapeHtml(titles[route] || "HelpDesk")}</h2>
        <span class="muted">Hola, ${escapeHtml(user?.name || "usuario")}</span>
      </div>

      <div class="topbar-actions">
        <a class="button button-secondary notification-link"
           href="#notifications"
           aria-label="Ver notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ""}">
          ♧ Notificaciones
          ${
            unreadCount > 0
              ? `<span class="notification-count">${unreadCount > 99 ? "99+" : unreadCount}</span>`
              : ""
          }
        </a>

        <span class="avatar" title="${escapeHtml(user?.name || "Usuario")}">
          ${escapeHtml((user?.name || "U").slice(0, 1).toUpperCase())}
        </span>
      </div>
    </header>
  `;
}
