const recetasService = require('./recetas.service');

async function getCatalogo(req, res, next) {
  try {
    const { tags, q, semana, categoria, dificultad, cocina } = req.query;
    const recetas = await recetasService.getCatalogo({ tags, q, semana, categoria, dificultad, cocina });
    res.json({ total: recetas.length, recetas });
  } catch (err) {
    next(err);
  }
}

async function getRecetaById(req, res, next) {
  try {
    const receta = await recetasService.getRecetaById(req.params.id);
    res.json(receta);
  } catch (err) {
    next(err);
  }
}

async function getPrecio(req, res, next) {
  try {
    const raciones = parseInt(req.query.raciones, 10);

    if (isNaN(raciones) || raciones < 1 || raciones > 20) {
      return res.status(400).json({
        error: 'El parámetro raciones debe ser un número entre 1 y 20.',
        code: 'INVALID_RACIONES',
      });
    }

    const precio = await recetasService.getPrecio(req.params.id, raciones);
    res.json(precio);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCatalogo, getRecetaById, getPrecio };
