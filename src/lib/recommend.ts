import type { Clima, Formalidad, Outfit, Prenda, Slot } from '../types';
import { SLOT_POR_CATEGORIA } from '../types';

/**
 * Generador de looks basado en reglas (fase 1, sin IA).
 *
 * Idea a futuro: reemplazar/complementar `elegirPorSlot` con una llamada a un
 * modelo (ej. pasarle el contexto + las prendas candidatas y que elija/rankee
 * la combinación) sin tocar el resto del flujo — esta función es el único
 * punto de entrada que le importa a la UI.
 */

function agruparPorSlot(prendas: Prenda[]): Record<Slot, Prenda[]> {
  const grupos: Record<Slot, Prenda[]> = {
    top: [],
    outerwear: [],
    bottom: [],
    fullbody: [],
    footwear: [],
    medias: [],
    ropa_interior: [],
    accesorio: [],
  };
  for (const p of prendas) {
    grupos[SLOT_POR_CATEGORIA[p.categoria]].push(p);
  }
  return grupos;
}

function filtrarPorContexto(prendas: Prenda[], clima: Clima, formalidad: Formalidad): Prenda[] {
  return prendas.filter(
    (p) => p.climas.includes(clima) && p.formalidades.includes(formalidad),
  );
}

function elegirAlAzar<T>(arr: T[], usados: Set<string>, idKey: (t: T) => string): T | undefined {
  const disponibles = arr.filter((x) => !usados.has(idKey(x)));
  const pool = disponibles.length > 0 ? disponibles : arr;
  if (pool.length === 0) return undefined;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Arma `cantidad` looks distintos para un clima/formalidad dados.
 * Regla simple: si hay vestido disponible, a veces arma looks "fullbody"
 * (vestido + accesorios), si no arma top+bottom. Siempre intenta sumar
 * calzado, medias y ropa interior si el usuario cargó ese tipo de prendas.
 */
export function generarOutfits(
  todasLasPrendas: Prenda[],
  clima: Clima,
  formalidad: Formalidad,
  cantidad = 3,
): Outfit[] {
  const candidatas = filtrarPorContexto(todasLasPrendas, clima, formalidad);
  const grupos = agruparPorSlot(candidatas);
  const outfits: Outfit[] = [];
  const usadosPorSlot: Record<Slot, Set<string>> = {
    top: new Set(),
    outerwear: new Set(),
    bottom: new Set(),
    fullbody: new Set(),
    footwear: new Set(),
    medias: new Set(),
    ropa_interior: new Set(),
    accesorio: new Set(),
  };

  for (let i = 0; i < cantidad; i++) {
    const prendas: Prenda[] = [];
    const usarVestido = grupos.fullbody.length > 0 && Math.random() < 0.4;

    if (usarVestido) {
      const vestido = elegirAlAzar(grupos.fullbody, usadosPorSlot.fullbody, (p) => p.id);
      if (vestido) {
        prendas.push(vestido);
        usadosPorSlot.fullbody.add(vestido.id);
      }
    } else {
      const top = elegirAlAzar(grupos.top, usadosPorSlot.top, (p) => p.id);
      const bottom = elegirAlAzar(grupos.bottom, usadosPorSlot.bottom, (p) => p.id);
      if (top) {
        prendas.push(top);
        usadosPorSlot.top.add(top.id);
      }
      if (bottom) {
        prendas.push(bottom);
        usadosPorSlot.bottom.add(bottom.id);
      }
    }

    // clima frío: sumar campera si hay
    if (clima === 'frio' && grupos.outerwear.length > 0) {
      const campera = elegirAlAzar(grupos.outerwear, usadosPorSlot.outerwear, (p) => p.id);
      if (campera) {
        prendas.push(campera);
        usadosPorSlot.outerwear.add(campera.id);
      }
    }

    const calzado = elegirAlAzar(grupos.footwear, usadosPorSlot.footwear, (p) => p.id);
    if (calzado) {
      prendas.push(calzado);
      usadosPorSlot.footwear.add(calzado.id);
    }

    const medias = elegirAlAzar(grupos.medias, usadosPorSlot.medias, (p) => p.id);
    if (medias) prendas.push(medias);

    // accesorio opcional, para no sobrecargar todos los looks
    if (grupos.accesorio.length > 0 && Math.random() < 0.6) {
      const accesorio = elegirAlAzar(grupos.accesorio, usadosPorSlot.accesorio, (p) => p.id);
      if (accesorio) {
        prendas.push(accesorio);
        usadosPorSlot.accesorio.add(accesorio.id);
      }
    }

    if (prendas.length > 0) outfits.push({ prendas });
  }

  return outfits;
}
