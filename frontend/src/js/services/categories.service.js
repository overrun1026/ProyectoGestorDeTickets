
import {
  apiGet,
  apiPost,
  apiPatch,
} from "../config/api.js";

export function listCategories() {
  return apiGet("/categories");
}

export function createCategory(data) {
  return apiPost("/categories", data);
}

export function updateCategory(id, data) {
  return apiPatch(`/categories/${encodeURIComponent(id)}`, data);
}
