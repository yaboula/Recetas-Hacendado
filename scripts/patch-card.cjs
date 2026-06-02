const fs = require('fs');
let c = fs.readFileSync('frontend/src/components/common/RecipeCard.jsx', 'utf8');

c = c.replace(
  'import { Heart, Clock, Users } from "lucide-react";',
  'import { Heart, Clock, Users } from "lucide-react";\nimport { getFlagUrl } from "@/lib/utils";'
);

c = c.replace(
  '{recipe.author && (\n              <>\n                <span>·</span>\n                <span>Por {recipe.author}</span>\n              </>\n            )}',
  '{recipe.author && (\n              <>\n                <span>·</span>\n                <span>Por {recipe.author}</span>\n              </>\n            )}\n            {recipe.cocina && (\n              <>\n                <span>·</span>\n                <span className="flex items-center gap-1.5">\n                  {getFlagUrl(recipe.cocina) && <img src={getFlagUrl(recipe.cocina)} alt="" className="w-4 h-auto rounded-sm shadow-sm" />} \n                  {recipe.cocina}\n                </span>\n              </>\n            )}'
);

c = c.replace(
  '{recipe.author && (\n                <>\n                  <span>·</span>\n                  <span>Por {recipe.author}</span>\n                </>\n              )}',
  '{recipe.author && (\n                <>\n                  <span>·</span>\n                  <span>Por {recipe.author}</span>\n                </>\n              )}\n              {recipe.cocina && (\n                <>\n                  <span>·</span>\n                  <span className="flex items-center gap-1.5">\n                    {getFlagUrl(recipe.cocina) && <img src={getFlagUrl(recipe.cocina)} alt="" className="w-4 h-auto rounded-sm shadow-sm" />} \n                    {recipe.cocina}\n                  </span>\n                </>\n              )}'
);

fs.writeFileSync('frontend/src/components/common/RecipeCard.jsx', c);
console.log('RecipeCard patched');
