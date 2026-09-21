import type { CSSProperties } from 'react';
import { Repeat, Trash2 } from 'lucide-react';
import type { Prenda } from '../types';
import { CATEGORIA_EMOJI, CATEGORIA_LABEL } from '../lib/labels';

interface Props {
  prenda: Prenda;
  onEliminar?: (prenda: Prenda) => void;
  onMarcarUso?: (prenda: Prenda) => void;
  compacta?: boolean;
  indice?: number;
}

const ROTACIONES = [-2.5, 1.5, -1, 2, -1.5, 1, 2.5, -2];

export function GarmentCard({ prenda, onEliminar, onMarcarUso, compacta, indice }: Props) {
  const costoPorUso =
    prenda.precio && prenda.usos > 0 ? Math.round(prenda.precio / prenda.usos) : null;
  const rotacion = compacta && indice !== undefined ? ROTACIONES[indice % ROTACIONES.length] : 0;

  return (
    <div
      className={compacta ? 'garment-card garment-card-compacta polaroid' : 'garment-card'}
      style={compacta ? ({ '--rot': `${rotacion}deg` } as CSSProperties) : undefined}
    >
      <div className="garment-img-wrap">
        <img src={prenda.fotoUrl} alt={prenda.nombre} loading="lazy" />
        <span className="garment-badge">{CATEGORIA_EMOJI[prenda.categoria]}</span>
        {prenda.usos > 0 && (
          <span className="garment-usos-badge">
            <Repeat size={10} /> {prenda.usos}
          </span>
        )}
        {onEliminar && (
          <button
            className="garment-eliminar"
            onClick={() => onEliminar(prenda)}
            aria-label={`Eliminar ${prenda.nombre}`}
            title="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="garment-info">
        <strong>{prenda.nombre}</strong>
        <span>
          {CATEGORIA_LABEL[prenda.categoria]} · {prenda.color}
        </span>
        {(onMarcarUso || costoPorUso) && (
          <div className="garment-info-fila">
            {onMarcarUso && (
              <button className="btn-uso" onClick={() => onMarcarUso(prenda)}>
                <Repeat size={11} /> Usé esto
              </button>
            )}
            {costoPorUso && <span className="garment-precio">${costoPorUso} / uso</span>}
          </div>
        )}
      </div>
    </div>
  );
}
