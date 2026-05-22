import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getFlagUrl(cocina) {
  if (!cocina) return null;
  const c = cocina.toLowerCase();
  let code = null;
  if (c.includes('españ')) code = 'es';
  else if (c.includes('ital')) code = 'it';
  else if (c.includes('mexic')) code = 'mx';
  else if (c.includes('japon')) code = 'jp';
  else if (c.includes('marr')) code = 'ma';
  else if (c.includes('india')) code = 'in';
  else if (c.includes('árab') || c.includes('arab')) code = 'ae';
  else if (c.includes('american')) code = 'us';
  else if (c.includes('frances') || c.includes('franci')) code = 'fr';
  else if (c.includes('chin')) code = 'cn';
  else if (c.includes('peru')) code = 'pe';
  else if (c.includes('tailand')) code = 'th';
  else if (c.includes('grieg')) code = 'gr';
  
  if (code) return `https://flagcdn.com/w20/${code}.png`;
  return null;
}
