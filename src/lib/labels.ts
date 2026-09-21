import type { Categoria, Clima, Formalidad } from '../types';

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  remera: 'Remera',
  camisa: 'Camisa',
  buzo: 'Buzo / Sweater',
  campera: 'Campera',
  pantalon: 'Pantalón',
  short: 'Short',
  pollera: 'Pollera',
  vestido: 'Vestido',
  zapatillas: 'Zapatillas',
  zapatos: 'Zapatos',
  medias: 'Medias',
  ropa_interior: 'Ropa interior',
  accesorio: 'Accesorio',
  anteojos: 'Anteojos',
  gorra: 'Gorra',
  cinturon: 'Cinturón',
  bufanda: 'Bufanda',
  otro: 'Otro',
};

// Emoji por categoría — se usan como ícono liviano en toda la app
// (no depende de que exista un ícono literal para cada prenda).
export const CATEGORIA_EMOJI: Record<Categoria, string> = {
  remera: '👕',
  camisa: '👔',
  buzo: '🧶',
  campera: '🧥',
  pantalon: '👖',
  short: '🩳',
  pollera: '🧵',
  vestido: '👗',
  zapatillas: '👟',
  zapatos: '👞',
  medias: '🧦',
  ropa_interior: '🩲',
  accesorio: '💍',
  anteojos: '🕶️',
  gorra: '🧢',
  cinturon: '⛓️',
  bufanda: '🧣',
  otro: '🏷️',
};

export const CLIMA_LABEL: Record<Clima, string> = {
  frio: 'Frío',
  templado: 'Templado',
  calor: 'Calor',
};

export const CLIMA_EMOJI: Record<Clima, string> = {
  frio: '❄️',
  templado: '⛅',
  calor: '☀️',
};

export const FORMALIDAD_LABEL: Record<Formalidad, string> = {
  casual: 'Casual',
  deportivo: 'Deportivo',
  formal: 'Formal',
  elegante: 'Elegante',
};

export const FORMALIDAD_EMOJI: Record<Formalidad, string> = {
  casual: '👖',
  deportivo: '🏃',
  formal: '💼',
  elegante: '✨',
};

export const TODAS_CATEGORIAS = Object.keys(CATEGORIA_LABEL) as Categoria[];
export const TODOS_CLIMAS = Object.keys(CLIMA_LABEL) as Clima[];
export const TODAS_FORMALIDADES = Object.keys(FORMALIDAD_LABEL) as Formalidad[];

export interface ColorSwatch {
  nombre: string;
  hex: string;
}

// Paleta de colores comunes de ropa, para elegir con un tap en vez de tipear.
export const COLOR_SWATCHES: ColorSwatch[] = [
  { nombre: 'Negro', hex: '#211e1c' },
  { nombre: 'Blanco', hex: '#f7f4ef' },
  { nombre: 'Gris', hex: '#8b8780' },
  { nombre: 'Azul marino', hex: '#28344c' },
  { nombre: 'Azul', hex: '#3d648f' },
  { nombre: 'Celeste', hex: '#93bcdc' },
  { nombre: 'Verde', hex: '#4c6e58' },
  { nombre: 'Verde oliva', hex: '#737b4c' },
  { nombre: 'Rojo', hex: '#b0433a' },
  { nombre: 'Bordó', hex: '#6d2f36' },
  { nombre: 'Rosa', hex: '#d99aa8' },
  { nombre: 'Naranja', hex: '#c97a3d' },
  { nombre: 'Amarillo', hex: '#d9b34e' },
  { nombre: 'Marrón', hex: '#6b4a35' },
  { nombre: 'Beige', hex: '#d8c8a9' },
  { nombre: 'Violeta', hex: '#6c5b96' },
];
