import { useMemo, useState } from 'react';
import { Shirt } from 'lucide-react';
import type { Categoria, Prenda } from '../types';
import { CATEGORIA_EMOJI, CATEGORIA_LABEL, TODAS_CATEGORIAS } from '../lib/labels';
import { GarmentCard } from './GarmentCard';

interface Props {
  prendas: Prenda[];
  onEliminar?: (prenda: Prenda) => void;
  onMarcarUso?: (prenda: Prenda) => void;
}

export function WardrobeGrid({ prendas, onEliminar, onMarcarUso }: Props) {
  const [filtro, setFiltro] = useState<Categoria | 'todas'>('todas');

  const categoriasConPrendas = useMemo(
    () => TODAS_CATEGORIAS.filter((c) => prendas.some((p) => p.categoria === c)),
    [prendas],
  );

  const visibles = filtro === 'todas' ? prendas : prendas.filter((p) => p.categoria === filtro);

  if (prendas.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icono">
          <Shirt size={26} strokeWidth={1.6} />
        </div>
        <p>Todavía no cargaste ninguna prenda.</p>
        <span>Andá a "+ Agregar" para empezar tu armario.</span>
      </div>
    );
  }

  return (
    <div>
      <div className="filtro-categorias">
        <button className={filtro === 'todas' ? 'chip chip-activo' : 'chip'} onClick={() => setFiltro('todas')}>
          Todas ({prendas.length})
        </button>
        {categoriasConPrendas.map((c) => {
          const cantidad = prendas.filter((p) => p.categoria === c).length;
          return (
            <button
              key={c}
              className={filtro === c ? 'chip chip-activo' : 'chip'}
              onClick={() => setFiltro(c)}
            >
              {CATEGORIA_EMOJI[c]} {CATEGORIA_LABEL[c]} ({cantidad})
            </button>
          );
        })}
      </div>
      <div className="garment-grid">
        {visibles.map((p, i) => (
          <div key={p.id} className="entrada-animada" style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}>
            <GarmentCard prenda={p} onEliminar={onEliminar} onMarcarUso={onMarcarUso} />
          </div>
        ))}
      </div>
    </div>
  );
}
