const router = require('express').Router();
const auth   = require('../../middleware/auth.middleware');
const ctrl   = require('./lista.controller');

router.use(auth);

// GET  /api/v1/lista                  → lista plana
// GET  /api/v1/lista?agrupada=true    → agrupada por sección (HU-08)
router.get('/',              ctrl.getLista);

// GET  /api/v1/lista/alternativas     → buscar alternativas
router.get('/alternativas',  ctrl.getAlternativas);

// GET  /api/v1/lista/productos        → buscar productos manuales
router.get('/productos',     ctrl.searchProductos);

// POST /api/v1/lista/items            → añadir receta (suma inteligente) (HU-07)
router.post('/items',        ctrl.addReceta);

// POST /api/v1/lista/manual           → añadir producto libre
router.post('/manual',       ctrl.addManualProduct);

// PATCH /api/v1/lista/items/:id       → toggle cogido (HU-08)
router.patch('/items/:id',   ctrl.toggleCogido);

// PATCH /api/v1/lista/items/:id/cantidad → actualizar paquetes físicos
router.patch('/items/:id/cantidad', ctrl.updatePaquetes);

// PATCH /api/v1/lista/items/:id/swap  → cambiar un producto por otro
router.patch('/items/:id/swap', ctrl.swapProducto);

// DELETE /api/v1/lista/items/:id      → eliminar un item (HU-08)
router.delete('/items/:id',  ctrl.deleteItem);

// DELETE /api/v1/lista                → vaciar toda la lista (HU-08)
router.delete('/',           ctrl.vaciarLista);

module.exports = router;
