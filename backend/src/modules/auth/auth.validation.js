
/*
 * Este archivo comprueba que los datos de registro e inicio de sesión
 * tengan el formato necesario antes de procesarlos.
 */
function validateRegister(req) {
  const { name, email, password } = req.body || {};
  const errors = [];

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    errors.push('El nombre debe tener entre 2 y 100 caracteres');
  }

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('El correo electrónico no es válido');
  }

  if (typeof password !== 'string' || password.length < 10 || password.length > 72) {
    errors.push('La contraseña debe tener entre 10 y 72 caracteres');
  }

  return errors;
}

function validateLogin(req) {
  const { email, password } = req.body || {};
  const errors = [];

  if (typeof email !== 'string' || !email.trim()) {
    errors.push('El correo electrónico es obligatorio');
  }

  if (typeof password !== 'string' || !password) {
    errors.push('La contraseña es obligatoria');
  }

  return errors;
}

module.exports = { validateRegister, validateLogin };
