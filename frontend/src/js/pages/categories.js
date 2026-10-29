
import {
  listCategories,
  createCategory,
  updateCategory,
} from "../services/categories.service.js";

import { escapeHtml } from "../utils/format-date.js";
import { isAdmin } from "../utils/permissions.js";
import { openModal } from "../components/modal.js";
import { showToast } from "../components/toast.js";

export async function renderCategories(container, user) {
  container.innerHTML = `
    <div class="loading-state">Cargando categorías...</div>
  `;

  const admin = isAdmin(user);

  try {
    const result = await listCategories();
    const categories = Array.isArray(result.data) ? result.data : [];

    container.innerHTML = `
      <div class="page-heading">
        <div>
          <h1>Categorías</h1>
          <p>Tipos de solicitudes disponibles en HelpDesk.</p>
        </div>

        ${
          admin
            ? `
              <button class="button button-primary" type="button"
                data-category-create>
                + Nueva categoría
              </button>
            `
            : ""
        }
      </div>

      <section class="stats-grid">
        ${
          categories.map(category => `
            <article class="stat-card category-card">
              <span class="stat-label">
                Categoría #${escapeHtml(category.id)}
              </span>

              <strong class="stat-value" style="font-size:20px">
                ${escapeHtml(category.name)}
              </strong>

              <p class="muted">
                ${escapeHtml(category.description || "Sin descripción")}
              </p>

              <span class="badge ${
                category.is_active ? "badge-resolved" : "badge-closed"
              }">
                ${category.is_active ? "Activa" : "Inactiva"}
              </span>

              ${
                admin
                  ? `
                    <div class="form-actions">
                      <button
                        class="button button-secondary"
                        type="button"
                        data-category-edit="${escapeHtml(category.id)}">
                        Editar
                      </button>

                      <button
                        class="button ${
                          category.is_active
                            ? "button-danger"
                            : "button-primary"
                        }"
                        type="button"
                        data-category-toggle="${escapeHtml(category.id)}"
                        data-active="${category.is_active ? "true" : "false"}">
                        ${category.is_active ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  `
                  : ""
              }
            </article>
          `).join("")
        }
      </section>

      ${
        categories.length
          ? ""
          : `<div class="empty-state">No hay categorías registradas.</div>`
      }
    `;

    if (!admin) return;

    container.querySelector("[data-category-create]")
      ?.addEventListener("click", () => {
        openCategoryForm(container, null, user);
      });

    container.querySelectorAll("[data-category-edit]")
      .forEach(button => {
        button.addEventListener("click", () => {
          const category = categories.find(
            item => Number(item.id) === Number(button.dataset.categoryEdit)
          );

          if (category) openCategoryForm(container, category, user);
        });
      });

    container.querySelectorAll("[data-category-toggle]")
      .forEach(button => {
        button.addEventListener("click", async () => {
          const category = categories.find(
            item => Number(item.id) === Number(button.dataset.categoryToggle)
          );

          if (!category) return;

          const currentlyActive = button.dataset.active === "true";
          const nextActive = !currentlyActive;
          const action = nextActive ? "activar" : "desactivar";

          if (!window.confirm(`¿Deseas ${action} la categoría "${category.name}"?`)) {
            return;
          }

          button.disabled = true;

          try {
            await updateCategory(category.id, {
              isActive: nextActive,
            });

            showToast(
              `Categoría ${nextActive ? "activada" : "desactivada"} correctamente.`,
              "success"
            );

            await renderCategories(container, user);
          } catch (error) {
            showToast(
              error.message || "No se pudo actualizar la categoría.",
              "error"
            );
            button.disabled = false;
          }
        });
      });
  } catch (error) {
    container.innerHTML = `
      <div class="error-message">
        ${escapeHtml(error.message || "No se pudieron cargar las categorías.")}
      </div>
    `;
  }
}

function openCategoryForm(container, category, user) {
  const editing = Boolean(category);

  const form = document.createElement("form");
  form.innerHTML = `
    <div class="form-field">
      <label for="category-name">Nombre</label>
      <input
        id="category-name"
        name="name"
        type="text"
        minlength="2"
        maxlength="80"
        required
        value="${escapeHtml(category?.name || "")}"
        placeholder="Ej. Soporte de red">
    </div>

    <div class="form-field">
      <label for="category-description">Descripción</label>
      <textarea
        id="category-description"
        name="description"
        maxlength="500"
        placeholder="Describe el tipo de solicitud">${escapeHtml(
          category?.description || ""
        )}</textarea>
    </div>

    <div class="form-actions">
      <button class="button button-secondary" type="button" data-close-modal>
        Cancelar
      </button>

      <button class="button button-primary" type="submit">
        ${editing ? "Guardar cambios" : "Crear categoría"}
      </button>
    </div>

    <p class="error-message" data-form-error role="alert"></p>
  `;

  const modal = openModal({
    title: editing ? "Editar categoría" : "Nueva categoría",
    content: form,
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const submitButton = form.querySelector('[type="submit"]');
    const errorElement = form.querySelector("[data-form-error]");
    const formData = new FormData(form);

    const data = {
      name: String(formData.get("name") || "").trim(),
      description: String(formData.get("description") || "").trim(),
    };

    if (data.name.length < 2 || data.name.length > 80) {
      errorElement.textContent = "El nombre debe tener entre 2 y 80 caracteres.";
      return;
    }

    if (data.description.length > 500) {
      errorElement.textContent = "La descripción no puede superar 500 caracteres.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";
    errorElement.textContent = "";

    try {
      if (editing) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }

      modal.close();

      showToast(
        editing
          ? "Categoría actualizada correctamente."
          : "Categoría creada correctamente.",
        "success"
      );

      // El usuario se conserva en el cierre del formulario mediante el
      // parámetro de renderCategories de la página actual.
      await renderCategories(container, user);
    } catch (error) {
      errorElement.textContent =
        error.message || "No se pudo guardar la categoría.";
      submitButton.disabled = false;
      submitButton.textContent = editing ? "Guardar cambios" : "Crear categoría";
    }
  });
}

