const fs = require('fs');
const path = require('path');
const pool = require('./src/config/database');

const PRODUCTS_DIR = path.join(__dirname, 'temp_dataset', 'products');

// Mapeo básico de las categorías de Mercadona a tus Secciones (chk_seccion)
function mapSeccion(mercadonaCategory) {
  const cat = (mercadonaCategory || '').toLowerCase();
  
  if (cat.includes('fruta') || cat.includes('verdura') || cat.includes('ensalada')) return 'Frutas y Verduras';
  if (cat.includes('carne') || cat.includes('ave') || cat.includes('charcutería')) return 'Carnes y Aves';
  if (cat.includes('pescado') || cat.includes('marisco') || cat.includes('sushi')) return 'Pescados y Mariscos';
  if (cat.includes('lácteo') || cat.includes('queso') || cat.includes('huevo') || cat.includes('leche')) return 'Lácteos y Huevos';
  if (cat.includes('panadería') || cat.includes('bollería') || cat.includes('postres')) return 'Panadería y Bollería';
  if (cat.includes('aceite') || cat.includes('conserva') || cat.includes('vinagre')) return 'Aceites y Conservas';
  if (cat.includes('pasta') || cat.includes('arroz') || cat.includes('legumbre')) return 'Pasta, Arroz y Legumbres';
  if (cat.includes('condimento') || cat.includes('especia') || cat.includes('salsa')) return 'Condimentos y Especias';
  if (cat.includes('bebida') || cat.includes('agua') || cat.includes('zumo') || cat.includes('bodega')) return 'Bebidas';
  if (cat.includes('congelado') || cat.includes('helado')) return 'Congelados';
  
  return 'Otros';
}

async function importCatalog() {
  const client = await pool.connect();
  
  try {
    const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.json'));
    console.log(`Encontrados ${files.length} productos para importar.`);
    
    let count = 0;
    for (const file of files) {
      const filePath = path.join(PRODUCTS_DIR, file);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const prod = JSON.parse(rawData);
      
      const mercadonaId = prod.id;
      const nombre = prod.display_name || prod.details?.description || 'Producto sin nombre';
      const marca = prod.brand || 'Mercadona';
      const precio = parseFloat(prod.price_instructions?.unit_price || prod.price_instructions?.bulk_price || 0);
      
      const cantidadPorEnvase = parseFloat(prod.price_instructions?.unit_size || 1);
      const unidadBase = prod.price_instructions?.size_format || 'ud';
      const unidadVenta = 'ud'; 
      const thumbnail_url = prod.thumbnail || null;
      const image_url = prod.photos?.[0]?.regular || null;
      const share_url = prod.share_url || null;
      
      let categoriaMercadona = 'Otros';
      let subcategoriaMercadona = null;

      if (prod.categories && prod.categories.length > 0) {
        const c0 = prod.categories[0];
        categoriaMercadona = c0.name;
        if (c0.categories && c0.categories.length > 0) {
          subcategoriaMercadona = c0.categories[0].name;
        }
      }

      const seccionTienda = mapSeccion(categoriaMercadona);
      const categoria = categoriaMercadona; // Lo que mostramos en DB
      
      const rawJson = JSON.stringify(prod);

      await client.query(`
        INSERT INTO productos_hacendado (
          mercadona_id, nombre, categoria, seccion_tienda, precio, 
          unidad_venta, cantidad_por_envase, unidad_base, marca,
          thumbnail_url, image_url, share_url, categoria_mercadona, subcategoria_mercadona, raw_json
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        ) ON CONFLICT (mercadona_id) DO UPDATE SET
          nombre = EXCLUDED.nombre,
          precio = EXCLUDED.precio,
          thumbnail_url = EXCLUDED.thumbnail_url,
          seccion_tienda = EXCLUDED.seccion_tienda,
          last_synced_at = NOW()
      `, [
        mercadonaId, nombre, categoria, seccionTienda, precio,
        unidadVenta, cantidadPorEnvase, unidadBase, marca,
        thumbnail_url, image_url, share_url, categoriaMercadona, subcategoriaMercadona, rawJson
      ]);

      count++;
      if (count % 500 === 0) console.log(`Importados ${count} / ${files.length}...`);
    }
    
    console.log(`¡Importación completada! Total: ${count} productos.`);
    
  } catch (e) {
    console.error('Error durante la importación:', e);
  } finally {
    client.release();
    pool.end();
  }
}

importCatalog();
