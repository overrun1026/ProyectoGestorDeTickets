
import { escapeHtml } from "../utils/format-date.js";

const links = [
  { route: "dashboard", icon: "◫", label: "Dashboard" },
  { route: "tickets", icon: "▤", label: "Tickets" },
  { route: "notifications", icon: "♧", label: "Notificaciones" },
  { route: "categories", icon: "◈", label: "Categorías" },
  { route: "users", icon: "♙", label: "Usuarios", admin: true },
];

export function renderSidebar(user, currentRoute, unreadCount = 0) {
  const name = user?.name || user?.email || "Usuario";

  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return `
    <aside class="sidebar">
      <a class="brand" href="#dashboard">
        <span class="brand-mark">H</span>
        <span>
          <span class="brand-name">HelpDesk</span>
          <span class="brand-caption" style="display:block">Centro de soporte</span>
        </span>
      </a>

      <div class="nav-section-label">Espacio de trabajo</div>

      <nav class="sidebar-nav" aria-label="Navegación principal">
        ${links
          .filter((link) => !link.admin || user?.role === "admin")
          .map((link) => `
            <a class="nav-link ${currentRoute === link.route ? "active" : ""}"
               href="#${link.route}">
              <span class="nav-icon" aria-hidden="true">${link.icon}</span>
              <span>${escapeHtml(link.label)}</span>

              ${
                link.route === "notifications" && unreadCount > 0
                  ? `<span class="notification-count">${unreadCount > 99 ? "99+" : unreadCount}</span>`
                  : ""
              }
            </a>
          `)
          .join("")}
      </nav>

      <div class="sidebar-footer">
        <div class="user-mini">
          <span class="avatar">${escapeHtml(initials)}</span>
          <div class="user-mini-info">
            <strong>${escapeHtml(name)}</strong>
            <span>${user?.role === "admin" ? "Administrador" : "Usuario"}</span>
          </div>
          <button class="icon-button" type="button" data-action="logout"
            aria-label="Cerrar sesión" title="Cerrar sesión">↪</button>
        </div>
      </div>
    </aside>
  `;
}
