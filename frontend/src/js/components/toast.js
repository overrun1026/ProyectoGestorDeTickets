
import { escapeHtml } from "../utils/format-date.js";

export function showToast(message, type = "info") {
  let container = document.querySelector("#toast-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.append(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = escapeHtml(message);
  container.append(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 4000);
}
