import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Camera, Check, RefreshCw } from 'lucide-react';
import type { Categoria, Clima, Formalidad } from '../types';
import {
  CATEGORIA_LABEL,
  CLIMA_EMOJI,
  CLIMA_LABEL,
  FORMALIDAD_EMOJI,
  FORMALIDAD_LABEL,
  TODAS_FORMALIDADES,
  TODOS_CLIMAS,
} from '../lib/labels';
import { CategoryPicker } from './CategoryPicker';
import { ColorPicker } from './ColorPicker';

interface Props {
  onGuardar: (datos: {
    categoria: Categoria;
    nombre: string;
    color: string;
    climas: Clima[];
    formalidades: Formalidad[];
    precio?: number;
    foto: File;
  }) => Promise<void>;
}

export function AddGarmentForm({ onGuardar }: Props) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<Categoria>('remera');
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('');
  const [climas, setClimas] = useState<Clima[]>([]);
  const [formalidades, setFormalidades] = useState<Formalidad[]>([]);
  const [precio, setPrecio] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFoto(f: File | null) {
    setFoto(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function toggle<T>(valor: T, lista: T[], setLista: (l: T[]) => void) {
    setLista(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);
  }

  function irAPaso2() {
    setError(null);
    if (!foto) return setError('Sacale o subí una foto de la prenda para continuar.');
    setPaso(2);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!foto) return setError('Falta la foto.');
    if (!nombre.trim()) return setError('Ponele un nombre corto a la prenda.');
    if (!color.trim()) return setError('Elegí o describí un color.');
    if (climas.length === 0) return setError('Marcá al menos un clima.');
    if (formalidades.length === 0) return setError('Marcá al menos una ocasión.');

    setGuardando(true);
    try {
      const precioNum = precio.trim() ? Number(precio) : undefined;
      await onGuardar({
        categoria,
        nombre: nombre.trim(),
        color: color.trim(),
        climas,
        formalidades,
        precio: precioNum && !Number.isNaN(precioNum) ? precioNum : undefined,
        foto,
      });
      handleFoto(null);
      setCategoria('remera');
      setNombre('');
      setColor('');
      setClimas([]);
      setFormalidades([]);
      setPrecio('');
      setPaso(1);
    } catch (err) {
      setError('No se pudo guardar la prenda. Probá de nuevo.');
      console.error(err);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="wizard">
      <div className="wizard-steps" aria-hidden="true">
        <div className={`wizard-step ${paso >= 1 ? 'wizard-step-activo' : ''}`}>
          <span>1</span> Foto y categoría
        </div>
        <div className="wizard-step-linea" />
        <div className={`wizard-step ${paso >= 2 ? 'wizard-step-activo' : ''}`}>
          <span>2</span> Detalles
        </div>
      </div>

      <form className="add-garment-form" onSubmit={handleSubmit}>
        {paso === 1 && (
          <div className="wizard-panel">
            <label className="foto-picker">
              {preview ? (
                <img src={preview} alt="preview" />
              ) : (
                <span className="foto-picker-placeholder">
                  <Camera size={28} strokeWidth={1.8} />
                  Sacar / subir foto
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFoto(e.target.files?.[0] ?? null)}
              />
            </label>
            {preview && (
              <div className="foto-acciones">
                <span className="foto-chip">
                  <Check size={13} /> Foto cargada
                </span>
                <button
                  type="button"
                  className="btn-texto"
                  onClick={() => {
                    const input = document.querySelector<HTMLInputElement>(
                      '.foto-picker input[type=file]',
                    );
                    input?.click();
                  }}
                >
                  <RefreshCw size={13} /> Cambiar
                </button>
              </div>
            )}

            <p className="field-label">Categoría</p>
            <CategoryPicker valor={categoria} onChange={setCategoria} />

            {error && <p className="form-error">{error}</p>}

            <button type="button" className="btn-primary btn-ancho" onClick={irAPaso2}>
              Siguiente <ArrowRight size={16} />
            </button>
          </div>
        )}

        {paso === 2 && (
          <div className="wizard-panel">
            {preview && (
              <div className="resumen-paso1">
                <img src={preview} alt="" />
                <div>
                  <strong>{CATEGORIA_LABEL[categoria]}</strong>
                  <button type="button" className="btn-texto" onClick={() => setPaso(1)}>
                    <ArrowLeft size={13} /> Editar foto/categoría
                  </button>
                </div>
              </div>
            )}

            <label>
              Nombre
              <input
                type="text"
                placeholder="Ej: Campera negra Levi's"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoFocus
              />
            </label>

            <p className="field-label">Color</p>
            <ColorPicker valor={color} onChange={setColor} />

            <p className="field-label">¿Para qué clima?</p>
            <div className="chip-selector">
              {TODOS_CLIMAS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={climas.includes(c) ? 'chip-toggle chip-toggle-activo' : 'chip-toggle'}
                  onClick={() => toggle(c, climas, setClimas)}
                >
                  {CLIMA_EMOJI[c]} {CLIMA_LABEL[c]}
                </button>
              ))}
            </div>

            <p className="field-label">¿Para qué ocasión?</p>
            <div className="chip-selector">
              {TODAS_FORMALIDADES.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={
                    formalidades.includes(f) ? 'chip-toggle chip-toggle-activo' : 'chip-toggle'
                  }
                  onClick={() => toggle(f, formalidades, setFormalidades)}
                >
                  {FORMALIDAD_EMOJI[f]} {FORMALIDAD_LABEL[f]}
                </button>
              ))}
            </div>

            <label>
              Precio <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(opcional — calculamos el costo por uso)</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="Ej: 25000"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <div className="wizard-acciones">
              <button type="button" className="btn-secundario" onClick={() => setPaso(1)}>
                <ArrowLeft size={16} /> Atrás
              </button>
              <button className="btn-primary" type="submit" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar prenda'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
