const fs = require('fs');
const path = require('path');

const newProducts = `
  { nombre: 'Lentejas pardinas Hacendado', categoria: 'Legumbres', seccion_tienda: 'Despensa', precio: 1.50, unidad_venta: '1 kg', cantidad_por_envase: 1000, unidad_base: 'g' },
  { nombre: 'Chorizo sarta Hacendado', categoria: 'Embutidos', seccion_tienda: 'Carnicería', precio: 2.10, unidad_venta: '250 g', cantidad_por_envase: 250, unidad_base: 'g' },
  { nombre: 'Ajos Hacendado', categoria: 'Verduras', seccion_tienda: 'Frutas y Verduras', precio: 1.20, unidad_venta: 'malla 4 uds', cantidad_por_envase: 4, unidad_base: 'ud' },
  { nombre: 'Lomos de salmón Hacendado', categoria: 'Pescado', seccion_tienda: 'Pescadería', precio: 5.95, unidad_venta: '300 g', cantidad_por_envase: 300, unidad_base: 'g' },
  { nombre: 'Tomate ensalada Hacendado', categoria: 'Verduras', seccion_tienda: 'Frutas y Verduras', precio: 1.80, unidad_venta: '1 kg', cantidad_por_envase: 1000, unidad_base: 'g' },
  { nombre: 'Jamón cocido extra Hacendado', categoria: 'Embutidos', seccion_tienda: 'Charcutería', precio: 2.30, unidad_venta: '200 g', cantidad_por_envase: 200, unidad_base: 'g' },
  { nombre: 'Pollo entero troceado Hacendado', categoria: 'Carne', seccion_tienda: 'Carnicería', precio: 4.50, unidad_venta: '1 kg', cantidad_por_envase: 1000, unidad_base: 'g' },
  { nombre: 'Vino blanco Hacendado', categoria: 'Bebidas', seccion_tienda: 'Bodega', precio: 1.50, unidad_venta: '1 l', cantidad_por_envase: 1000, unidad_base: 'ml' },
  { nombre: 'Aguacates Hacendado', categoria: 'Frutas', seccion_tienda: 'Frutas y Verduras', precio: 2.99, unidad_venta: '500 g', cantidad_por_envase: 500, unidad_base: 'g' },
  { nombre: 'Espirales Hacendado', categoria: 'Pasta', seccion_tienda: 'Despensa', precio: 0.85, unidad_venta: '500 g', cantidad_por_envase: 500, unidad_base: 'g' },
  { nombre: 'Salsa Pesto Hacendado', categoria: 'Salsas', seccion_tienda: 'Despensa', precio: 1.95, unidad_venta: '190 g', cantidad_por_envase: 190, unidad_base: 'g' },
  { nombre: 'Pan de molde rústico Hacendado', categoria: 'Panadería', seccion_tienda: 'Panadería', precio: 1.40, unidad_venta: '450 g', cantidad_por_envase: 10, unidad_base: 'ud' },
  { nombre: 'Manzana Fuji Hacendado', categoria: 'Frutas', seccion_tienda: 'Frutas y Verduras', precio: 1.99, unidad_venta: '1 kg', cantidad_por_envase: 6, unidad_base: 'ud' },
  { nombre: 'Plátano de Canarias Hacendado', categoria: 'Frutas', seccion_tienda: 'Frutas y Verduras', precio: 2.10, unidad_venta: '1 kg', cantidad_por_envase: 6, unidad_base: 'ud' },
  { nombre: 'Naranja Hacendado', categoria: 'Frutas', seccion_tienda: 'Frutas y Verduras', precio: 1.50, unidad_venta: '1 kg', cantidad_por_envase: 5, unidad_base: 'ud' }
`;

const fileContent = fs.readFileSync(path.join(__dirname, 'src', 'database', 'seeds', '01_productos.seed.js'), 'utf8');
const exportIndex = fileContent.lastIndexOf('];');
if (exportIndex !== -1) {
  const newContent = fileContent.substring(0, exportIndex) + ',' + newProducts + fileContent.substring(exportIndex);
  fs.writeFileSync(path.join(__dirname, 'src', 'database', 'seeds', '01_productos.seed.js'), newContent, 'utf8');
  console.log('Successfully appended 15 products to 01_productos.seed.js');
} else {
  console.log('Could not find ]; to append products.');
}
