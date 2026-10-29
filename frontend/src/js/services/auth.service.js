
import { apiGet, apiPost } from "../config/api.js";
import { setSession, clearSession } from "../utils/storage.js";

export async function login({ email, password }) {
  const result = await apiPost("/auth/login", { email, password });

  if (!result.token || !result.user) {
    throw new Error("La respuesta de inicio de sesión no contiene el token y el usuario esperados.");
  }

  setSession(result.token, result.user);
  return result.user;
}

export async function register({ name, email, password }) {
  return apiPost("/auth/register", { name, email, password });
}

export async function getCurrentUser() {
  return apiGet("/auth/me");
}

export function logout() {
  clearSession();
}
