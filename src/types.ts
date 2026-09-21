// Tipos centrales del armario virtual

export type Categoria =
  | 'remera'
  | 'camisa'
  | 'buzo'
  | 'campera'
  | 'pantalon'
  | 'short'
  | 'pollera'
  | 'vestido'
  | 'zapatillas'
  | 'zapatos'
  | 'medias'
  | 'ropa_interior'
  | 'accesorio'
  | 'anteojos'
  | 'gorra'
  | 'cinturon'
  | 'bufanda'
  | 'otro';

// A qué "slot" del look pertenece cada categoría, para armar combinaciones
export type Slot =
  | 'top'
  | 'outerwear'
  | 'bottom'
  | 'fullbody' // vestido: reemplaza top+bottom
  | 'footwear'
  | 'medias'
  | 'ropa_interior'
  | 'accesorio';

export const SLOT_POR_CATEGORIA: Record<Categoria, Slot> = {
  remera: 'top',
  camisa: 'top',
  buzo: 'top',
  campera: 'outerwear',
  pantalon: 'bottom',
  short: 'bottom',
  pollera: 'bottom',
  vestido: 'fullbody',
  zapatillas: 'footwear',
  zapatos: 'footwear',
  medias: 'medias',
  ropa_interior: 'ropa_interior',
  accesorio: 'accesorio',
  anteojos: 'accesorio',
  gorra: 'accesorio',
  cinturon: 'accesorio',
  bufanda: 'accesorio',
  otro: 'accesorio',
};

export type Clima = 'frio' | 'templado' | 'calor';

export type Formalidad = 'casual' | 'deportivo' | 'formal' | 'elegante';

export interface Prenda {
  id: string;
  uid: string; // dueño (auth.uid)
  categoria: Categoria;
  nombre: string; // ej: "Campera negra Levi's"
  color: string; // color dominante, texto libre ej: "negro", "azul marino"
  climas: Clima[]; // en qué climas la usa
  formalidades: Formalidad[]; // para qué ocasiones sirve
  fotoUrl: string; // URL en Firebase Storage
  notas?: string;
  creadoEn: number; // timestamp
  usos: number; // cuántas veces marcaste "usé esto hoy"
  ultimoUso?: number; // timestamp del último uso registrado
  precio?: number; // costo de compra opcional, para calcular costo por uso
}

export interface Outfit {
  prendas: Prenda[];
}

export interface FiltroOcasion {
  clima: Clima;
  formalidad: Formalidad;
}

// Un look generado que el usuario decidió guardar como favorito
export interface LookGuardado {
  id: string;
  uid: string;
  prendaIds: string[];
  clima: Clima;
  formalidad: Formalidad;
  creadoEn: number;
}
