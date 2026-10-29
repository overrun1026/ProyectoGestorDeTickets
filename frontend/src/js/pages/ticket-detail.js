
import {
  getTicket,
  getTicketHistory,
  updateTicket,
} from "../services/tickets.service.js";
import {
  listComments,
  createComment,
} from "../services/comments.service.js";
import { formatDate, escapeHtml } from "../utils/format-date.js";
import { isAdmin } from "../utils/permissions.js";
import { renderLoader } from "../components/loader.js";

export async function renderTicketDetail(container, id, user) {
  container.replaceChildren(renderLoader("Cargando ticket..."));

  try {
    const [ticketResponse, historyResponse, commentsResponse] =
      await Promise.all([
        getTicket(id),
        getTicketHistory(id),
        listComments(id),
      ]);

    const ticket =
      ticketResponse.ticket ||
      ticketResponse.data ||
      ticketResponse;

    const history = Array.isArray(historyResponse.data)
      ? historyResponse.data
      : [];

    const comments = Array.isArray(commentsResponse.data)
      ? commentsResponse.data
      : [];

    const admin = isAdmin(user);

    // El backend sigue siendo la autoridad sobre los permisos.
    const isOwner =
      String(ticket.created_by ?? ticket.user_id ?? "") ===
      String(user?.id ?? "");

    const canEdit = admin || isOwner;

    container.innerHTML = `
      <div class="page-heading">
        <a class="table-link" href="#tickets">← Volver a tickets</a>
        <h1 style="margin-top:12px">${escapeHtml(ticket.title)}</h1>
        <p>
          Ticket #${escapeHtml(ticket.id)}
          · Creado ${escapeHtml(formatDate(ticket.created_at))}
        </p>
      </div>

      <div class="dashboard-grid">
        <section class="card ticket-detail">
          <div class="toolbar-group">
            <span class="badge badge-${escapeHtml(ticket.status)}">
              ${escapeHtml(ticket.status)}
            </span>
            <span class="badge badge-${escapeHtml(ticket.priority)}">
              ${escapeHtml(ticket.priority)}
            </span>
          </div>

          <h2 class="card-title">Descripción</h2>
          <div class="ticket-detail-description">
            ${escapeHtml(ticket.description)}
          </div>

          ${canEdit ? `
            <div style="margin-top:24px">
              <button
                class="button button-secondary"
                id="toggle-ticket-edit"
                type="button"
                aria-expanded="false"
                aria-controls="ticket-edit-panel"
              >
                Editar ticket
              </button>
            </div>

            <form id="ticket-update-form" hidden>
              <h3>Editar ticket</h3>

              <div class="form-field">
                <label for="detail-title">Título</label>
                <input
                  id="detail-title"
                  name="title"
                  type="text"
                  minlength="3"
                  maxlength="200"
                  value="${escapeHtml(ticket.title)}"
                  required
                />
              </div>

              <div class="form-field">
                <label for="detail-description">Descripción</label>
                <textarea
                  id="detail-description"
                  name="description"
                  minlength="5"
                  maxlength="10000"
                  required
                >${escapeHtml(ticket.description)}</textarea>
              </div>

              ${admin ? `
                <div class="form-field">
                  <label for="detail-status">Estado</label>
                  <select id="detail-status" name="status">
                    ${[
                      ["open", "Abierto"],
                      ["in_progress", "En progreso"],
                      ["resolved", "Resuelto"],
                      ["closed", "Cerrado"],
                    ].map(([value, label]) => `
                      <option
                        value="${value}"
                        ${ticket.status === value ? "selected" : ""}
                      >${label}</option>
                    `).join("")}
                  </select>
                </div>

                <div class="form-field">
                  <label for="detail-priority">Prioridad</label>
                  <select id="detail-priority" name="priority">
                    ${[
                      ["low", "Baja"],
                      ["medium", "Media"],
                      ["high", "Alta"],
                      ["critical", "Crítica"],
                    ].map(([value, label]) => `
                      <option
                        value="${value}"
                        ${ticket.priority === value ? "selected" : ""}
                      >${label}</option>
                    `).join("")}
                  </select>
                </div>
              ` : ""}

              <div class="toolbar-group">
                <button class="button button-primary" type="submit">
                  Guardar cambios
                </button>
                <button
                  class="button button-secondary"
                  id="cancel-ticket-edit"
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ` : ""}

          <div id="ticket-detail-error" role="alert"></div>
        </section>

        <section class="card">
          <h2 class="card-title">Conversación</h2>

          <div class="comment-list">
            ${comments.length ? comments.map(comment => `
              <article class="comment">
                <div class="comment-meta">
                  <strong>
                    ${escapeHtml(comment.author_name || "Usuario")}
                  </strong>
                  <span>${escapeHtml(formatDate(comment.created_at))}</span>
                </div>
                <div class="comment-body">
                  ${escapeHtml(comment.body)}
                </div>
              </article>
            `).join("") : `
              <div class="empty-state">Todavía no hay comentarios.</div>
            `}
          </div>

          <form id="ticket-comment-form">
            <div class="form-field">
              <label for="comment-body">Añadir comentario</label>
              <textarea
                id="comment-body"
                name="body"
                maxlength="5000"
                required
              ></textarea>
            </div>
            <button class="button button-primary" type="submit">
              Enviar comentario
            </button>
          </form>
        </section>
      </div>

      <section class="card" style="margin-top:22px">
        <h2 class="card-title">Historial de actividad</h2>

        ${history.length ? `
          <div class="history-list">
            ${history.map(item => `
              <div class="history-item">
                <strong>${escapeHtml(item.action || "Evento")}</strong>
                <p>
                  ${escapeHtml(formatDate(item.created_at))}
                  · ${escapeHtml(item.user_name || "Usuario")}
                </p>
                <p>
                  ${escapeHtml(JSON.stringify(item.details || {}))}
                </p>
              </div>
            `).join("")}
          </div>
        ` : `
          <div class="empty-state">No hay eventos en el historial.</div>
        `}
      </section>
    `;

    const editButton = container.querySelector("#toggle-ticket-edit");
    const editForm = container.querySelector("#ticket-update-form");
    const cancelButton = container.querySelector("#cancel-ticket-edit");

    if (editButton && editForm) {
      

      editButton.addEventListener("click", () => {
        editForm.hidden = !editForm.hidden;
        editButton.setAttribute("aria-expanded", String(!editForm.hidden));
        editButton.textContent = editForm.hidden
          ? "Editar ticket"
          : "Ocultar edición";
      });

      cancelButton?.addEventListener("click", () => {
        editForm.reset();
        editForm.hidden = true;
        editButton.setAttribute("aria-expanded", "false");
        editButton.textContent = "Editar ticket";
      });
    }
  } catch (error) {
    container.innerHTML = `
      <div class="error-message">${escapeHtml(error.message)}</div>
      <a class="button button-secondary" href="#tickets">
        Volver a tickets
      </a>
    `;
  }
}

export async function submitComment(ticketId, form) {
  const data = new FormData(form);
  const body = String(data.get("body") || "").trim();

  if (!body) {
    throw new Error("Escribe un comentario antes de enviarlo.");
  }

  return createComment(ticketId, body);
}

export async function submitTicketUpdate(ticketId, form, user) {
  const data = new FormData(form);

  const payload = {
    title: String(data.get("title") || "").trim(),
    description: String(data.get("description") || "").trim(),
  };

  if (isAdmin(user)) {
    payload.status = data.get("status");
    payload.priority = data.get("priority");
  }

  return updateTicket(ticketId, payload);
}
