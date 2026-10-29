
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function validateRequired(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}
