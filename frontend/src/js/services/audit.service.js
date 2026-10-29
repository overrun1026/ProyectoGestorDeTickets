
/*
 * El backend registra los eventos de auditoría.
 * La consulta desde el frontend queda pendiente de confirmar
 * la ruta HTTP correspondiente en el módulo de auditoría.
 */

export async function listAuditEvents() {
  throw new Error(
    "La consulta de auditoría desde el frontend aún no está conectada a una ruta API confirmada."
  );
}
