
import { apiGet } from "../config/api.js";

export function getDashboardStats() {
  return apiGet("/dashboard/stats");
}
