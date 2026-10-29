
import { escapeHtml } from "../utils/format-date.js";

export function renderProfile(container, user) {
  container.innerHTML = `
    <div class="page-heading">
      <h1>Mi perfil</h1>
      <p>Información de la sesión actual.</p>
    </div>

    <section class="card">
      <div class="user-mini">
        <span class="avatar">${escapeHtml((user?.name || "U").slice(0, 1).toUpperCase())}</span>
        <div class="user-mini-info">
          <strong>${escapeHtml(user?.name || "Usuario")}</strong>
          <span>${escapeHtml(user?.email || "")}</span>
        </div>
      </div>

      <div class="form-field">
        <label>Nombre</label>
        <input value="${escapeHtml(user?.name || "")}" readonly />
      </div>

      <div class="form-field">
        <label>Correo electrónico</label>
        <input value="${escapeHtml(user?.email || "")}" readonly />
      </div>

      <div class="form-field">
        <label>Rol</label>
        <input value="${escapeHtml(user?.role || "user")}" readonly />
      </div>

      <p class="muted">La edición del perfil se habilitará cuando confirmemos los endpoints correspondientes del backend.</p>
    </section>
  `;
}
