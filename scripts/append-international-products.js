const fs = require('fs');
const path = require('path');

const newProducts = `
  { nombre: 'Mascarpone Hacendado', categoria: 'Lácteos', seccion_tienda: 'Lácteos y Huevos', precio: 2.30, unidad_venta: '250 g', cantidad_por_envase: 250, unidad_base: 'g' },
  { nombre: 'Salsa Teriyaki Hacendado', categoria: 'Salsas', seccion_tienda: 'Condimentos y Especias', precio: 1.80, unidad_venta: '250 ml', cantidad_por_envase: 250, unidad_base: 'ml' },
  { nombre: 'Tortillas de maíz Hacendado', categoria: 'Panadería', seccion_tienda: 'Panadería y Bollería', precio: 1.50, unidad_venta: '10 uds', cantidad_por_envase: 10, unidad_base: 'ud' },
  { nombre: 'Nata líquida para postres Hacendado', categoria: 'Lácteos', seccion_tienda: 'Lácteos y Huevos', precio: 1.20, unidad_venta: '500 ml', cantidad_por_envase: 500, unidad_base: 'ml' },
  { nombre: 'Algas Nori Hacendado', categoria: 'Internacional', seccion_tienda: 'Pasta, Arroz y Legumbres', precio: 2.10, unidad_venta: '5 uds', cantidad_por_envase: 5, unidad_base: 'ud' },
  { nombre: 'Arroz para sushi Hacendado', categoria: 'Arroz', seccion_tienda: 'Pasta, Arroz y Legumbres', precio: 1.60, unidad_venta: '500 g', cantidad_por_envase: 500, unidad_base: 'g' },
  { nombre: 'Queso Parmesano Hacendado', categoria: 'Lácteos', seccion_tienda: 'Lácteos y Huevos', precio: 3.50, unidad_venta: '200 g', cantidad_por_envase: 200, unidad_base: 'g' },
  { nombre: 'Salsa César Hacendado', categoria: 'Salsas', seccion_tienda: 'Condimentos y Especias', precio: 1.40, unidad_venta: '250 ml', cantidad_por_envase: 250, unidad_base: 'ml' },
  { nombre: 'Mantequilla sin sal Hacendado', categoria: 'Lácteos', seccion_tienda: 'Lácteos y Huevos', precio: 2.00, unidad_venta: '250 g', cantidad_por_envase: 250, unidad_base: 'g' },
  { nombre: 'Chocolate fondant postres Hacendado', categoria: 'Dulces', seccion_tienda: 'Otros', precio: 1.25, unidad_venta: '250 g', cantidad_por_envase: 250, unidad_base: 'g' },
  { nombre: 'Nueces peladas Hacendado', categoria: 'Frutos Secos', seccion_tienda: 'Otros', precio: 3.20, unidad_venta: '200 g', cantidad_por_envase: 200, unidad_base: 'g' },
  { nombre: 'Leche de coco Hacendado', categoria: 'Internacional', seccion_tienda: 'Bebidas', precio: 1.45, unidad_venta: '400 ml', cantidad_por_envase: 400, unidad_base: 'ml' },
  { nombre: 'Salsa Tikka Masala Hacendado', categoria: 'Internacional', seccion_tienda: 'Condimentos y Especias', precio: 2.00, unidad_venta: '300 g', cantidad_por_envase: 300, unidad_base: 'g' },
  { nombre: 'Yogur griego natural Hacendado', categoria: 'Lácteos', seccion_tienda: 'Lácteos y Huevos', precio: 1.60, unidad_venta: '6 uds', cantidad_por_envase: 6, unidad_base: 'ud' },
  { nombre: 'Cilantro fresco Hacendado', categoria: 'Verduras', seccion_tienda: 'Frutas y Verduras', precio: 1.00, unidad_venta: '1 ud', cantidad_por_envase: 1, unidad_base: 'ud' },
  { nombre: 'Maicena Hacendado', categoria: 'Despensa', seccion_tienda: 'Pasta, Arroz y Legumbres', precio: 1.10, unidad_venta: '400 g', cantidad_por_envase: 400, unidad_base: 'g' },
  { nombre: 'Azúcar blanco Hacendado', categoria: 'Despensa', seccion_tienda: 'Otros', precio: 1.35, unidad_venta: '1 kg', cantidad_por_envase: 1000, unidad_base: 'g' },
  { nombre: 'Cuscús Hacendado', categoria: 'Despensa', seccion_tienda: 'Pasta, Arroz y Legumbres', precio: 1.15, unidad_venta: '500 g', cantidad_por_envase: 500, unidad_base: 'g' },
  { nombre: 'Limón Hacendado', categoria: 'Frutas', seccion_tienda: 'Frutas y Verduras', precio: 1.80, unidad_venta: '1 kg', cantidad_por_envase: 6, unidad_base: 'ud' },
  { nombre: 'Aceitunas verdes deshuesadas Hacendado', categoria: 'Aperitivos', seccion_tienda: 'Aceites y Conservas', precio: 1.40, unidad_venta: '3 uds', cantidad_por_envase: 3, unidad_base: 'ud' },
  { nombre: 'Placas de lasaña Hacendado', categoria: 'Pasta', seccion_tienda: 'Pasta, Arroz y Legumbres', precio: 1.50, unidad_venta: '20 uds', cantidad_por_envase: 20, unidad_base: 'ud' },
  { nombre: 'Bizcochos de soletilla Hacendado', categoria: 'Dulces', seccion_tienda: 'Panadería y Bollería', precio: 1.45, unidad_venta: '400 g', cantidad_por_envase: 400, unidad_base: 'g' },
  { nombre: 'Cacao puro en polvo Hacendado', categoria: 'Despensa', seccion_tienda: 'Otros', precio: 2.60, unidad_venta: '250 g', cantidad_por_envase: 250, unidad_base: 'g' },
  { nombre: 'Arroz redondo Hacendado', categoria: 'Arroz', seccion_tienda: 'Pasta, Arroz y Legumbres', precio: 1.20, unidad_venta: '1 kg', cantidad_por_envase: 1000, unidad_base: 'g' },
  { nombre: 'Gambón crudo Hacendado', categoria: 'Pescado', seccion_tienda: 'Congelados', precio: 8.50, unidad_venta: '1 kg', cantidad_por_envase: 1000, unidad_base: 'g' },
  { nombre: 'Mejillón de Chile Hacendado', categoria: 'Pescado', seccion_tienda: 'Congelados', precio: 3.50, unidad_venta: '500 g', cantidad_por_envase: 500, unidad_base: 'g' },
  { nombre: 'Guisantes finos Hacendado', categoria: 'Verduras', seccion_tienda: 'Congelados', precio: 1.30, unidad_venta: '1 kg', cantidad_por_envase: 1000, unidad_base: 'g' },
  { nombre: 'Pimiento verde Hacendado', categoria: 'Verduras', seccion_tienda: 'Frutas y Verduras', precio: 1.99, unidad_venta: '1 kg', cantidad_por_envase: 1000, unidad_base: 'g' },
  { nombre: 'Pepino Hacendado', categoria: 'Verduras', seccion_tienda: 'Frutas y Verduras', precio: 1.20, unidad_venta: '1 kg', cantidad_por_envase: 1000, unidad_base: 'g' },
  { nombre: 'Picatostes Hacendado', categoria: 'Panadería', seccion_tienda: 'Panadería y Bollería', precio: 1.00, unidad_venta: '100 g', cantidad_por_envase: 100, unidad_base: 'g' },
  { nombre: 'Sazonador para Fajitas Hacendado', categoria: 'Condimentos', seccion_tienda: 'Condimentos y Especias', precio: 1.25, unidad_venta: '30 g', cantidad_por_envase: 30, unidad_base: 'g' },
  { nombre: 'Piña en su jugo Hacendado', categoria: 'Conservas', seccion_tienda: 'Aceites y Conservas', precio: 1.80, unidad_venta: '500 g', cantidad_por_envase: 500, unidad_base: 'g' },
  { nombre: 'Tortillas chips nachos Hacendado', categoria: 'Aperitivos', seccion_tienda: 'Otros', precio: 1.10, unidad_venta: '150 g', cantidad_por_envase: 150, unidad_base: 'g' },
  { nombre: 'Vinagre de arroz Hacendado', categoria: 'Salsas', seccion_tienda: 'Condimentos y Especias', precio: 1.50, unidad_venta: '250 ml', cantidad_por_envase: 250, unidad_base: 'ml' },
  { nombre: 'Sésamo tostado Hacendado', categoria: 'Especias', seccion_tienda: 'Condimentos y Especias', precio: 1.35, unidad_venta: '50 g', cantidad_por_envase: 50, unidad_base: 'g' },
  { nombre: 'Brócoli Hacendado', categoria: 'Verduras', seccion_tienda: 'Frutas y Verduras', precio: 1.50, unidad_venta: '500 g', cantidad_por_envase: 500, unidad_base: 'g' },
  { nombre: 'Pan de pita Hacendado', categoria: 'Panadería', seccion_tienda: 'Panadería y Bollería', precio: 1.40, unidad_venta: '6 uds', cantidad_por_envase: 6, unidad_base: 'ud' },
  { nombre: 'Huevos Hacendado M', categoria: 'Huevos', seccion_tienda: 'Lácteos y Huevos', precio: 2.20, unidad_venta: '1 docena', cantidad_por_envase: 12, unidad_base: 'ud' },
  { nombre: 'Canela molida Hacendado', categoria: 'Especias', seccion_tienda: 'Condimentos y Especias', precio: 1.00, unidad_venta: '50 g', cantidad_por_envase: 50, unidad_base: 'g' }
`;

const fileContent = fs.readFileSync(path.join(__dirname, 'src', 'database', 'seeds', '01_productos.seed.js'), 'utf8');
const exportIndex = fileContent.lastIndexOf('];');
if (exportIndex !== -1) {
  const newContent = fileContent.substring(0, exportIndex) + ',' + newProducts + fileContent.substring(exportIndex);
  fs.writeFileSync(path.join(__dirname, 'src', 'database', 'seeds', '01_productos.seed.js'), newContent, 'utf8');
  console.log('Successfully appended international products to 01_productos.seed.js');
} else {
  console.log('Could not find ]; to append products.');
}
