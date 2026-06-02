const fs = require('fs');
const path = require('path');

const newProducts = `
  { nombre: 'Tomate pera Hacendado', categoria: 'Verduras', seccion_tienda: 'Frutas y Verduras', precio: 1.85, unidad_venta: '1 kg', cantidad_por_envase: 1000, unidad_base: 'g' },
  { nombre: 'Corazones de lechuga romana Hacendado', categoria: 'Verduras', seccion_tienda: 'Frutas y Verduras', precio: 1.20, unidad_venta: '3 uds', cantidad_por_envase: 3, unidad_base: 'ud' }
`;

const fileContent = fs.readFileSync(path.join(__dirname, 'src', 'database', 'seeds', '01_productos.seed.js'), 'utf8');
const exportIndex = fileContent.lastIndexOf('];');
if (exportIndex !== -1) {
  const newContent = fileContent.substring(0, exportIndex) + ',' + newProducts + fileContent.substring(exportIndex);
  fs.writeFileSync(path.join(__dirname, 'src', 'database', 'seeds', '01_productos.seed.js'), newContent, 'utf8');
  console.log('Successfully appended more missing products to 01_productos.seed.js');
} else {
  console.log('Could not find ]; to append products.');
}
