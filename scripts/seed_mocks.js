const pool = require('./src/config/database');

async function seed() {
  const baseQuery = `
    INSERT INTO productos_hacendado (id, nombre, categoria, marca, precio, cantidad_por_envase, unidad_base, seccion_tienda) 
    VALUES (gen_random_uuid(), $1, 'Mock', $2, $3, $4, $5, $6)
  `;
  try {
    await pool.query(baseQuery, ['Huevos Hacendado L', 'Hacendado', 2.30, 12, 'ud', 'Lácteos y Huevos']);
    await pool.query(baseQuery, ['Huevos Camperos', 'Hacendado', 3.10, 12, 'ud', 'Lácteos y Huevos']);
    await pool.query(baseQuery, ['Media Docena Huevos M', 'Hacendado', 1.10, 6, 'ud', 'Lácteos y Huevos']);
    
    await pool.query(baseQuery, ['Aceite de oliva Suave Hacendado', 'Hacendado', 4.50, 1000, 'ml', 'Aceites y Conservas']);
    await pool.query(baseQuery, ['Aceite de oliva virgen extra Hacendado (Garrafa 3L)', 'Hacendado', 14.50, 3000, 'ml', 'Aceites y Conservas']);
    console.log('OK');
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
seed();
