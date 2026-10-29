
import { escapeHtml } from "../utils/format-date.js";

export function openModal({ title, content, onClose }) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const modal = document.createElement("section");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", title);

  modal.innerHTML = `
    <div class="modal-header">
      <h2>${escapeHtml(title)}</h2>
      <button class="icon-button" type="button" data-close-modal aria-label="Cerrar">×</button>
    </div>
    <div class="modal-content"></div>
  `;

  const contentElement = modal.querySelector(".modal-content");

  if (content instanceof Node) {
    contentElement.append(content);
  } else {
    contentElement.textContent = String(content ?? "");
  }

  backdrop.append(modal);
  document.body.append(backdrop);

  function close() {
    backdrop.remove();
    document.removeEventListener("keydown", onKeydown);
    onClose?.();
  }

  function onKeydown(event) {
    if (event.key === "Escape") close();
  }

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop || event.target.closest("[data-close-modal]")) {
      close();
    }
  });

  document.addEventListener("keydown", onKeydown);
  modal.querySelector("[data-close-modal]").focus();

  return { close, element: modal };
}
