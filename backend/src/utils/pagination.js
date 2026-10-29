
/*
 * Este archivo calcula los límites de paginación y el desplazamiento que
 * utilizarán las consultas SQL de los listados.
 */
function getPagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(query.limit, 10) || 10)
  );

  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
}

module.exports = getPagination;
