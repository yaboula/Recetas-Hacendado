const router = require('express').Router();
const auth   = require('../../middleware/auth.middleware');
const ctrl   = require('./favoritos.controller');

router.use(auth);

// GET  /api/v1/favoritos               → recetas favoritas del usuario
router.get('/',                  ctrl.getFavoritos);

// POST /api/v1/favoritos/:recetaId     → toggle (añade o elimina)
router.post('/:recetaId',        ctrl.toggleFavorito);

module.exports = router;
