const fs = require('fs');
const f = 'src/database/seeds/01_productos.seed.js';
let c = fs.readFileSync(f, 'utf8');

c = c.replace(/seccion_tienda:\s*'Despensa'/g, "seccion_tienda: 'Pasta, Arroz y Legumbres'");
c = c.replace(/seccion_tienda:\s*'Carnicería'/g, "seccion_tienda: 'Carnes y Aves'");
c = c.replace(/seccion_tienda:\s*'Carnicer.a'/g, "seccion_tienda: 'Carnes y Aves'");
c = c.replace(/seccion_tienda:\s*'Pescadería'/g, "seccion_tienda: 'Pescados y Mariscos'");
c = c.replace(/seccion_tienda:\s*'Pescader.a'/g, "seccion_tienda: 'Pescados y Mariscos'");
c = c.replace(/seccion_tienda:\s*'Charcutería'/g, "seccion_tienda: 'Carnes y Aves'");
c = c.replace(/seccion_tienda:\s*'Charcuter.a'/g, "seccion_tienda: 'Carnes y Aves'");
c = c.replace(/seccion_tienda:\s*'Bodega'/g, "seccion_tienda: 'Bebidas'");
c = c.replace(/seccion_tienda:\s*'Panadería'/g, "seccion_tienda: 'Panadería y Bollería'");
c = c.replace(/seccion_tienda:\s*'Panader.a'/g, "seccion_tienda: 'Panadería y Bollería'");

fs.writeFileSync(f, c, 'utf8');
console.log('Fixed seccion_tienda values.');
