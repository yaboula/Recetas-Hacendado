const pool = require('./src/config/database');

async function getIds() {
  try {
    const huevos = await pool.query("SELECT mercadona_id, nombre FROM productos_hacendado WHERE nombre ILIKE '%Huevos%' AND nombre ILIKE '%M%' LIMIT 1");
    const aceite = await pool.query("SELECT mercadona_id, nombre FROM productos_hacendado WHERE nombre ILIKE '%Aceite de oliva%' LIMIT 1");
    
    console.log('Huevos:', huevos.rows[0]);
    console.log('Aceite:', aceite.rows[0]);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
getIds();
