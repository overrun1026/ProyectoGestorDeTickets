
export function renderPagination({ page, totalPages }) {
  const nav = document.createElement("nav");
  nav.className = "pagination";
  nav.setAttribute("aria-label", "Paginación");

  if (!totalPages || totalPages <= 1) {
    return nav;
  }

  nav.innerHTML = `
    <button class="button button-secondary" data-page="${page - 1}"
      ${page <= 1 ? "disabled" : ""}>Anterior</button>
    <span>Página ${page} de ${totalPages}</span>
    <button class="button button-secondary" data-page="${page + 1}"
      ${page >= totalPages ? "disabled" : ""}>Siguiente</button>
  `;

  return nav;
}
