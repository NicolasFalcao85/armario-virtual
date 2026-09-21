import { useState } from 'react';
import { Check } from 'lucide-react';
import { COLOR_SWATCHES } from '../lib/labels';

interface Props {
  valor: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ valor, onChange }: Props) {
  const coincide = COLOR_SWATCHES.some((s) => s.nombre.toLowerCase() === valor.toLowerCase());
  const [mostrarCustom, setMostrarCustom] = useState(!coincide && valor !== '');

  return (
    <div className="color-picker">
      <div className="color-swatches">
        {COLOR_SWATCHES.map((s) => {
          const activo = valor.toLowerCase() === s.nombre.toLowerCase();
          const clara = ['Blanco', 'Beige', 'Amarillo', 'Celeste', 'Rosa'].includes(s.nombre);
          return (
            <button
              key={s.nombre}
              type="button"
              className={activo ? 'swatch swatch-activo' : 'swatch'}
              style={{ background: s.hex }}
              title={s.nombre}
              aria-label={s.nombre}
              onClick={() => {
                setMostrarCustom(false);
                onChange(s.nombre);
              }}
            >
              {activo && <Check size={14} color={clara ? '#211e1c' : '#fff'} strokeWidth={3} />}
            </button>
          );
        })}
        <button
          type="button"
          className={mostrarCustom ? 'swatch swatch-custom swatch-activo' : 'swatch swatch-custom'}
          title="Otro color"
          aria-label="Otro color"
          onClick={() => setMostrarCustom(true)}
        >
          +
        </button>
      </div>
      {mostrarCustom && (
        <input
          type="text"
          className="color-custom-input"
          placeholder="Describí el color (ej: estampado floral)"
          value={coincide ? '' : valor}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
      )}
    </div>
  );
}
