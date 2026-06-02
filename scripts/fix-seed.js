const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/database/seeds/02_recetas.seed.js');
let content = fs.readFileSync(file, 'utf8');

// The original file is a JS file. We can replace the wrong keys:
// 1. faq: [{ question: ..., answer: ... }] -> faq: [{ pregunta: ..., respuesta: ... }]
content = content.replace(/question:/g, 'pregunta:').replace(/answer:/g, 'respuesta:');

// 2. tips: -> consejos:
content = content.replace(/tips:/g, 'consejos:');

// 3. For pasos and consejos, they are currently arrays of objects in the appended recipes.
// { orden: 1, descripcion: '...' } -> '...'
// { orden: 1, texto: '...' } -> '...'
// I can use regex to replace { orden: \d+, (descripcion|texto): ('[^']+') } with $2
content = content.replace(/\{\s*orden:\s*\d+,\s*(?:descripcion|texto):\s*('[^']+')\s*\}/g, '$1');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed seeds structure.');
