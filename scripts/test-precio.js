require('dotenv').config();
const { getPrecio } = require('./src/modules/recetas/recetas.service');

async function test() {
  try {
    const pool = require('./src/config/database');
    const res = await pool.query("SELECT id FROM recetas WHERE nombre = 'Espaguetis a la boloñesa casera'");
    if (res.rows.length === 0) return;
    const id = res.rows[0].id;
    
    const ingsRes = await pool.query(
      `SELECT ir.cantidad_base, ir.unidad as receta_unidad, ph.precio, ph.cantidad_por_envase, ph.unidad_base as producto_unidad, ph.nombre
       FROM ingredientes_receta ir
       JOIN productos_hacendado ph ON ph.id = ir.producto_id
       WHERE ir.receta_id = $1`,
      [id]
    );
    console.log("Ingredients:", ingsRes.rows);

    pool.end();
  } catch (err) {
    console.error(err);
  }
}
test();
