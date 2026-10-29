
import { apiGet, apiPost } from "../config/api.js";

export function listComments(ticketId) {
  return apiGet(`/tickets/${encodeURIComponent(ticketId)}/comments`);
}

export function createComment(ticketId, body) {
  return apiPost(
    `/tickets/${encodeURIComponent(ticketId)}/comments`,
    { body }
  );
}
