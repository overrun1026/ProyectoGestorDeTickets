
import { createTicket } from "../services/tickets.service.js";
import { listCategories } from "../services/categories.service.js";
import { escapeHtml } from "../utils/format-date.js";

export async function renderTicketCreate(container) {
  container.innerHTML = `<div class="loading-state">Cargando formulario...</div>`;

  try {
    const result = await listCategories();
    const categories = Array.isArray(result.data) ? result.data : [];

    container.innerHTML = `
      <div class="page-heading">
        <h1>Crear ticket</h1>
        <p>Describe tu solicitud para que el equipo pueda ayudarte.</p>
      </div>

      <article class="card">
        <form id="ticket-create-form">
          <div class="form-field">
            <label for="ticket-title">Título</label>
            <input id="ticket-title" name="title" minlength="3"
              maxlength="200" required />
          </div>

          <div class="form-field">
            <label for="ticket-description">Descripción</label>
            <textarea id="ticket-description" name="description"
              minlength="5" maxlength="10000" required></textarea>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label for="ticket-priority">Prioridad</label>
              <select id="ticket-priority" name="priority">
                <option value="low">Baja</option>
                <option value="medium" selected>Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>

            <div class="form-field">
              <label for="ticket-category">Categoría</label>
              <select id="ticket-category" name="categoryId">
                <option value="">Sin categoría</option>
                ${categories.filter(c => c.is_active).map(c =>
                  `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`
                ).join("")}
              </select>
            </div>
          </div>

          <div id="ticket-create-error" role="alert"></div>
          <div class="form-actions">
            <a class="button button-secondary" href="#tickets">Cancelar</a>
            <button class="button button-primary" type="submit">Crear ticket</button>
          </div>
        </form>
      </article>
    `;
  } catch (error) {
    container.innerHTML = `<div class="error-message">${escapeHtml(error.message)}</div>`;
  }
}

export async function submitTicketCreate(form) {
  const data = new FormData(form);

  const payload = {
    title: String(data.get("title") || "").trim(),
    description: String(data.get("description") || "").trim(),
    priority: String(data.get("priority") || "medium"),
  };

  const categoryId = String(data.get("categoryId") || "");
  if (categoryId) payload.categoryId = Number(categoryId);

  return createTicket(payload);
}
