const fs = require('fs');
try {
  const files = fs.readdirSync('./temp_dataset/products');
  if (files.length > 0) {
    const filePath = './temp_dataset/products/' + files[0];
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log('No hay archivos en la carpeta.');
  }
} catch (e) {
  console.error('Error:', e);
}
