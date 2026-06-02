const fs = require('fs');
let c = fs.readFileSync('frontend/src/pages/RecetaPage.jsx', 'utf8');

c = c.replace(
  'import { getFlagEmoji } from "@/lib/utils";',
  'import { getFlagUrl } from "@/lib/utils";'
);

// We need to find the eyebrow block.
const oldBlock = `          <p className="eyebrow">\n            {[recipe.category, recipe.cuisine ? \`\${getFlagEmoji(recipe.cuisine)} \${recipe.cuisine}\` : null].filter(Boolean).join(" · ") || recipe.eyebrow}\n          </p>`;

const newBlock = `          <div className="eyebrow flex items-center gap-2">\n            {[recipe.category, recipe.cuisine].filter(Boolean).join(" · ") || recipe.eyebrow}\n            {recipe.cuisine && getFlagUrl(recipe.cuisine) && (\n              <img src={getFlagUrl(recipe.cuisine)} alt="" className="w-5 h-auto rounded-sm shadow-sm" />\n            )}\n          </div>`;

c = c.replace(oldBlock, newBlock);

fs.writeFileSync('frontend/src/pages/RecetaPage.jsx', c);
console.log('RecetaPage patched');
