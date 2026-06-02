const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://www.hogarmania.com/cocina/recetas/sopas-cremas/crema-calabaza-3140.html').then(r => {
  const $ = cheerio.load(r.data);
  const ingClass = $('[class*="ingred"]').attr('class') || $('[class*="ingre"]').attr('class');
  const stepClass = $('[class*="step"]').attr('class') || $('[class*="paso"]').attr('class');
  console.log("Ing class:", ingClass);
  console.log("Step class:", stepClass);
});
