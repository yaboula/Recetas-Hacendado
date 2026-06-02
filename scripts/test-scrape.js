const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://www.hogarmania.com/cocina/recetas/').then(r => {
  const $ = cheerio.load(r.data);
  const urls = [];
  $('a').each((_, el) => {
    let h = $(el).attr('href');
    if (h && h.includes('receta') && h.endsWith('.html')) {
      if (!h.startsWith('http')) h = 'https://www.hogarmania.com' + h;
      urls.push(h);
    }
  });
  console.log([...new Set(urls)].slice(0, 10));
});
