
/*
 * Este archivo registra usuarios y comprueba sus credenciales para emitir
 * tokens JWT con los que podrán acceder a las rutas protegidas.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const AppError = require('../../utils/AppError');
const usersRepository = require('../users/users.repository');

async function register({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await usersRepository.findByEmail(normalizedEmail);

  if (existing) {
    throw new AppError('Ya existe una cuenta con ese correo', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await usersRepository.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'user'
  });

  return publicUser(user);
}

async function login({ email, password }) {
  const user = await usersRepository.findByEmail(email.trim().toLowerCase());

  if (!user || !user.is_active) {
    throw new AppError('Correo o contraseña incorrectos', 401);
  }

  const matches = await bcrypt.compare(password, user.password_hash);

  if (!matches) {
    throw new AppError('Correo o contraseña incorrectos', 401);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return {
    token,
    tokenType: 'Bearer',
    expiresIn: env.jwtExpiresIn,
    user: publicUser(user)
  };
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at
  };
}

module.exports = { register, login, publicUser };
