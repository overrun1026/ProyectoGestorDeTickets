
import { apiGet, apiPatch } from "../config/api.js";

export function listUsers(params = {}) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }

  const suffix = query.toString();
  return apiGet(`/users${suffix ? `?${suffix}` : ""}`);
}

export function updateUser(id, data) {
  return apiPatch(`/users/${encodeURIComponent(id)}`, data);
}
