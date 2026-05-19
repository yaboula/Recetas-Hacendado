const router = require('express').Router();
const auth   = require('../../middleware/auth.middleware');
const ctrl   = require('./recetas.controller');

// Todas las rutas de recetas requieren autenticación
router.use(auth);

// GET /api/v1/recetas?tags=VEGANO,SIN_GLUTEN&q=pollo&semana=2026-05-12
router.get('/', ctrl.getCatalogo);

// GET /api/v1/recetas/:id
router.get('/:id', ctrl.getRecetaById);

// GET /api/v1/recetas/:id/precio?raciones=6
router.get('/:id/precio', ctrl.getPrecio);

module.exports = router;
