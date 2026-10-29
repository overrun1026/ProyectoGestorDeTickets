
import { apiGet, apiPatch } from "../config/api.js";

export function listNotifications() {
  return apiGet("/notifications");
}

export function markNotificationRead(id) {
  return apiPatch(`/notifications/${encodeURIComponent(id)}/read`);
}
