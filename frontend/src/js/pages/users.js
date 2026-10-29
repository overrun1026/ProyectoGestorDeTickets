
import { listUsers } from "../services/users.service.js";
import { formatDate, escapeHtml } from "../utils/format-date.js";

export async function renderUsers(container) {
  container.innerHTML = `<div class="loading-state">Cargando usuarios...</div>`;

  try {
    const result = await listUsers({ page: 1, limit: 100 });
    const users = Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.users)
        ? result.users
        : Array.isArray(result)
          ? result
          : [];

    container.innerHTML = `
      <div class="page-heading">
        <h1>Usuarios</h1>
        <p>Listado de cuentas registradas en el sistema.</p>
      </div>

      <section class="card">
        ${users.length ? `
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Registro</th></tr>
              </thead>
              <tbody>
                ${users.map(user => `
                  <tr>
                    <td>${escapeHtml(user.name)}</td>
                    <td>${escapeHtml(user.email)}</td>
                    <td>${escapeHtml(user.role)}</td>
                    <td><span class="badge ${user.is_active ? "badge-resolved" : "badge-closed"}">
                      ${user.is_active ? "Activo" : "Inactivo"}
                    </span></td>
                    <td>${escapeHtml(formatDate(user.created_at))}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : `<div class="empty-state">No hay usuarios para mostrar o la respuesta utiliza otro formato.</div>`}
      </section>
    `;
  } catch (error) {
    container.innerHTML = `<div class="error-message">${escapeHtml(error.message)}</div>`;
  }
}
