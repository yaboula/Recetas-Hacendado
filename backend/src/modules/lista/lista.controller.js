const listaService = require('./lista.service');

async function getLista(req, res, next) {
  try {
    const agrupada = req.query.agrupada === 'true';
    const lista    = await listaService.getLista(req.usuario.id, agrupada);
    res.json(agrupada ? { agrupada: lista } : { items: lista, total: lista.length });
  } catch (err) {
    next(err);
  }
}

async function addReceta(req, res, next) {
  try {
    const { receta_id, raciones = 4 } = req.body;

    if (!receta_id) {
      return res.status(400).json({ error: 'El campo receta_id es obligatorio.', code: 'MISSING_RECETA_ID' });
    }

    const racionesNum = parseInt(raciones, 10);
    if (isNaN(racionesNum) || racionesNum < 1 || racionesNum > 20) {
      return res.status(400).json({ error: 'Las raciones deben ser un número entre 1 y 20.', code: 'INVALID_RACIONES' });
    }

    const lista = await listaService.addRecetaToLista(req.usuario.id, receta_id, racionesNum);
    res.status(201).json({ message: 'Ingredientes añadidos a tu lista.', items: lista, total: lista.length });
  } catch (err) {
    next(err);
  }
}

async function getAlternativas(req, res, next) {
  try {
    const productId = req.query.producto_id;
    if (!productId) {
      return res.status(400).json({ error: 'Falta producto_id' });
    }
    const alternativas = await listaService.getAlternativas(productId);
    res.json(alternativas);
  } catch (err) {
    next(err);
  }
}

async function searchProductos(req, res, next) {
  try {
    const query = req.query.q;
    const productos = await listaService.searchProductosLibres(query);
    res.json(productos);
  } catch (err) {
    next(err);
  }
}

async function addManualProduct(req, res, next) {
  try {
    const { producto_id } = req.body;
    if (!producto_id) return res.status(400).json({ error: 'Falta producto_id' });
    const lista = await listaService.addManualProduct(req.usuario.id, producto_id);
    res.status(201).json({ message: 'Producto añadido', items: lista });
  } catch (err) {
    next(err);
  }
}

async function swapProducto(req, res, next) {
  try {
    const { nuevo_producto_id } = req.body;
    if (!nuevo_producto_id) return res.status(400).json({ error: 'Falta nuevo_producto_id' });
    const lista = await listaService.swapItemProducto(req.usuario.id, req.params.id, nuevo_producto_id);
    res.json({ message: 'Producto cambiado', items: lista });
  } catch (err) {
    next(err);
  }
}

async function toggleCogido(req, res, next) {
  try {
    const result = await listaService.toggleCogido(req.usuario.id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function updatePaquetes(req, res, next) {
  try {
    const paquetes = req.body.paquetes;
    if (typeof paquetes !== 'number' || paquetes < 0) {
      return res.status(400).json({ error: 'paquetes debe ser un número entero >= 0', code: 'INVALID_PAQUETES' });
    }
    const result = await listaService.updateItemPaquetes(req.usuario.id, req.params.id, paquetes);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    await listaService.deleteItem(req.usuario.id, req.params.id);
    res.json({ message: 'Item eliminado de la lista.' });
  } catch (err) {
    next(err);
  }
}

async function vaciarLista(req, res, next) {
  try {
    await listaService.vaciarLista(req.usuario.id);
    res.json({ message: 'Lista vaciada correctamente.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  getLista, 
  addReceta, 
  getAlternativas, 
  searchProductos, 
  addManualProduct, 
  swapProducto, 
  toggleCogido, 
  updatePaquetes, 
  deleteItem, 
  vaciarLista 
};
