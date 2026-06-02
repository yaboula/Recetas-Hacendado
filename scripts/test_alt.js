const pool = require('./src/config/database');

async function test() {
  const pRes = await pool.query('SELECT nombre, seccion_tienda FROM productos_hacendado WHERE id = $1', ['61fb968f-162f-49ee-bc4d-a397df98fe4f']);
  console.log('Original:', pRes.rows[0]);

  const { nombre, seccion_tienda } = pRes.rows[0];
  const keyword = nombre.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
  console.log('Keyword:', keyword, 'Seccion:', seccion_tienda);

  const altRes = await pool.query(
    `SELECT id, nombre, seccion_tienda 
     FROM productos_hacendado
     WHERE seccion_tienda = $1 AND id != $2 AND nombre ILIKE $3
     LIMIT 5`,
    [seccion_tienda, '61fb968f-162f-49ee-bc4d-a397df98fe4f', `${keyword}%`]
  );
  console.log('Resultados estrictos:', altRes.rows);

  const altRes2 = await pool.query(
    `SELECT id, nombre, seccion_tienda 
     FROM productos_hacendado
     WHERE nombre ILIKE $1
     LIMIT 5`,
    [`${keyword}%`]
  );
  console.log('Resultados laxos (solo keyword):', altRes2.rows);

  pool.end();
}
test();
