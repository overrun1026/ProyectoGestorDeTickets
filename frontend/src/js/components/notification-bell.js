
export function renderNotificationBell(count = 0) {
  return `
    <a class="button button-secondary" href="#notifications">
      Notificaciones
      ${count > 0 ? `<span class="badge badge-in_progress">${count}</span>` : ""}
    </a>
  `;
}
