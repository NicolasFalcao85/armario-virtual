import type { Categoria } from '../types';
import { CATEGORIA_EMOJI, CATEGORIA_LABEL, TODAS_CATEGORIAS } from '../lib/labels';

interface Props {
  valor: Categoria;
  onChange: (c: Categoria) => void;
}

export function CategoryPicker({ valor, onChange }: Props) {
  return (
    <div className="category-picker" role="radiogroup" aria-label="Categoría de la prenda">
      {TODAS_CATEGORIAS.map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={valor === c}
          className={valor === c ? 'category-option category-option-activa' : 'category-option'}
          onClick={() => onChange(c)}
        >
          <span className="category-emoji">{CATEGORIA_EMOJI[c]}</span>
          <span>{CATEGORIA_LABEL[c]}</span>
        </button>
      ))}
    </div>
  );
}
