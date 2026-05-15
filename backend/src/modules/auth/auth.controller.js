const authService = require('./auth.service');

async function register(req, res, next) {
  try {
    const data = await authService.register(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  // Con JWT stateless el logout es responsabilidad del cliente (eliminar el token).
  // Aquí devolvemos confirmación para que el frontend sepa que puede limpiar su estado.
  res.json({ message: 'Sesión cerrada correctamente.' });
}

async function getMe(req, res, next) {
  try {
    const usuario = await authService.getMe(req.usuario.id);
    res.json(usuario);
  } catch (err) {
    next(err);
  }
}

async function updatePreferencias(req, res, next) {
  try {
    const preferencias = await authService.updatePreferencias(
      req.usuario.id,
      req.body.preferencias
    );
    res.json({ message: 'Preferencias actualizadas.', preferencias });
  } catch (err) {
    next(err);
  }
}

async function updatePerfil(req, res, next) {
  try {
    const usuario = await authService.updatePerfil(req.usuario.id, req.body);
    res.json({ message: 'Perfil actualizado.', usuario });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    await authService.changePassword(req.usuario.id, req.body.current_password, req.body.new_password);
    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    next(err);
  }
}

async function getProfileStats(req, res, next) {
  try {
    const data = await authService.getProfileStats(req.usuario.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, getMe, updatePreferencias, updatePerfil, changePassword, getProfileStats };
