
import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "../config/api.js";

export function listTickets(filters = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  const query = params.toString();
  return apiGet(`/tickets${query ? `?${query}` : ""}`);
}

export function getTicket(id) {
  return apiGet(`/tickets/${encodeURIComponent(id)}`);
}

export function createTicket(data) {
  return apiPost("/tickets", data);
}

export function updateTicket(id, data) {
  return apiPatch(`/tickets/${encodeURIComponent(id)}`, data);
}

export function deleteTicket(id) {
  return apiDelete(`/tickets/${encodeURIComponent(id)}`);
}

export function getTicketHistory(id) {
  return apiGet(`/tickets/${encodeURIComponent(id)}/history`);
}
