const favoritosService = require('./favoritos.service');

async function getFavoritos(req, res, next) {
  try {
    const favoritos = await favoritosService.getFavoritos(req.usuario.id);
    res.json({ total: favoritos.length, favoritos });
  } catch (err) {
    next(err);
  }
}

async function toggleFavorito(req, res, next) {
  try {
    const result = await favoritosService.toggleFavorito(req.usuario.id, req.params.recetaId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getFavoritos, toggleFavorito };
