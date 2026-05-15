require('dotenv').config({ path: require('path').join(__dirname, '../..', '.env') });

const pool = require('../config/database');

async function main() {
  const ingredientsResult = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE COALESCE(ph.image_url, ph.thumbnail_url, ph.foto_url) IS NOT NULL) AS with_image,
      COUNT(*) AS total
    FROM ingredientes_receta ir
    JOIN productos_hacendado ph ON ph.id = ir.producto_id
  `);

  const recipesResult = await pool.query(`
    SELECT
      r.nombre,
      COALESCE(
        r.foto_url,
        MAX(COALESCE(ph.image_url, ph.thumbnail_url, ph.foto_url))
      ) AS foto_url
    FROM recetas r
    LEFT JOIN ingredientes_receta ir ON ir.receta_id = r.id
    LEFT JOIN productos_hacendado ph ON ph.id = ir.producto_id
    GROUP BY r.id
    ORDER BY r.nombre ASC
  `);

  console.log('INGREDIENTS_IMAGE_STATS');
  console.log(JSON.stringify(ingredientsResult.rows[0], null, 2));
  console.log('RECIPES_IMAGE_STATS');
  console.log(JSON.stringify(recipesResult.rows, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
