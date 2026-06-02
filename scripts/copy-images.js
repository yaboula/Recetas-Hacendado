const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\aboul\\.gemini\\antigravity-ide\\brain\\360d636f-7d99-4fb7-a3cf-85a6dd4207a4';
const destDir = 'd:\\Users\\aboul\\Desktop\\3.2_Proyectos__giles__Scrum_y_Kanban_\\Scrum-Mercadona-CyberPandas\\frontend\\public\\img\\recetas';

const fileMap = {
  'tajin_pollo': 'tajin.png',
  'cuscus_verduras': 'cuscus.png',
  'lasana_carne': 'lasana.png',
  'tiramisu_casero': 'tiramisu.png',
  'paella_mixta': 'paella.png',
  'gazpacho_andaluz': 'gazpacho.png',
  'tacos_pastor': 'tacos.png',
  'guacamole_autentico': 'guacamole_autentico.png',
  'maki_sushi': 'sushi.png',
  'pollo_teriyaki': 'teriyaki.png',
  'tikka_masala': 'tikka.png',
  'falafel_yogur': 'falafel.png',
  'ensalada_cesar': 'cesar.png',
  'brownie_chocolate': 'brownie.png',
  'crema_catalana': 'crema_catalana.png'
};

const files = fs.readdirSync(srcDir);
for (const file of files) {
  for (const [prefix, newName] of Object.entries(fileMap)) {
    if (file.startsWith(prefix) && file.endsWith('.png')) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, newName);
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} to ${newName}`);
    }
  }
}
