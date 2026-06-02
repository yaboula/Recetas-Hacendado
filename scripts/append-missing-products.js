const fs = require('fs');
const path = require('path');

const newProducts = `
  { nombre: 'Uvas pasas sultanas Hacendado', categoria: 'Frutos Secos', seccion_tienda: 'Otros', precio: 1.50, unidad_venta: '250 g', cantidad_por_envase: 250, unidad_base: 'g' },
  { nombre: 'Café molido Hacendado', categoria: 'Café', seccion_tienda: 'Bebidas', precio: 2.10, unidad_venta: '250 g', cantidad_por_envase: 250, unidad_base: 'g' }
`;

const fileContent = fs.readFileSync(path.join(__dirname, 'src', 'database', 'seeds', '01_productos.seed.js'), 'utf8');
const exportIndex = fileContent.lastIndexOf('];');
if (exportIndex !== -1) {
  const newContent = fileContent.substring(0, exportIndex) + ',' + newProducts + fileContent.substring(exportIndex);
  fs.writeFileSync(path.join(__dirname, 'src', 'database', 'seeds', '01_productos.seed.js'), newContent, 'utf8');
  console.log('Successfully appended missing products to 01_productos.seed.js');
} else {
  console.log('Could not find ]; to append products.');
}
