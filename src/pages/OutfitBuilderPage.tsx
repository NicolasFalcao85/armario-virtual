import { useState } from 'react';
import { Heart, Shuffle, Sparkles, Trash2, Wand2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWardrobe } from '../hooks/useWardrobe';
import { eliminarLook, guardarLook, prendasDeLook, useLooks } from '../hooks/useLooks';
import { generarOutfits } from '../lib/recommend';
import type { Clima, Formalidad, LookGuardado, Outfit, Prenda } from '../types';
import {
  CLIMA_EMOJI,
  CLIMA_LABEL,
  FORMALIDAD_EMOJI,
  FORMALIDAD_LABEL,
  TODAS_FORMALIDADES,
  TODOS_CLIMAS,
} from '../lib/labels';
import { GarmentCard } from '../components/GarmentCard';
import { SkeletonGrid } from '../components/Skeleton';
import { useToast } from '../components/Toast';

export function OutfitBuilderPage() {
  const { user } = useAuth();
  const { prendas, loading } = useWardrobe(user?.uid);
  const { looks, loading: loadingLooks } = useLooks(user?.uid);
  const toast = useToast();

  const [tab, setTab] = useState<'proponer' | 'guardados'>('proponer');
  const [clima, setClima] = useState<Clima>('templado');
  const [formalidad, setFormalidad] = useState<Formalidad>('casual');
  const [outfits, setOutfits] = useState<Outfit[] | null>(null);
  const [generando, setGenerando] = useState(false);

  function generar() {
    setGenerando(true);
    // pequeño delay artificial: da sensación de "está pensando" la combinación
    setTimeout(() => {
      setOutfits(generarOutfits(prendas, clima, formalidad, 3));
      setGenerando(false);
    }, 450);
  }

  async function handleGuardar(outfit: Outfit) {
    if (!user) return;
    try {
      await guardarLook(user.uid, outfit, clima, formalidad);
      toast.success('Look guardado en tus favoritos ❤️');
    } catch {
      toast.error('No se pudo guardar el look');
    }
  }

  if (loading) {
    return (
      <div>
        <div className="page-heading">
          <h2>Tu estilista</h2>
        </div>
        <SkeletonGrid cantidad={4} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-heading">
        <span className="page-kicker">
          <Wand2 size={13} /> Estilista con IA
        </span>
        <h2>Armá tu próximo look</h2>
        <p className="page-subtitle">Decime el contexto y te propongo combinaciones con lo que ya cargaste.</p>
      </div>

      <div className="outfit-tabs">
        <button
          className={tab === 'proponer' ? 'outfit-tab outfit-tab-activo' : 'outfit-tab'}
          onClick={() => setTab('proponer')}
        >
          Proponer
        </button>
        <button
          className={tab === 'guardados' ? 'outfit-tab outfit-tab-activo' : 'outfit-tab'}
          onClick={() => setTab('guardados')}
        >
          Guardados {looks.length > 0 && `(${looks.length})`}
        </button>
      </div>

      {tab === 'proponer' && (
        <>
          <p className="field-label">Clima</p>
          <div className="chip-selector">
            {TODOS_CLIMAS.map((c) => (
              <button
                key={c}
                type="button"
                className={clima === c ? 'chip-toggle chip-toggle-activo' : 'chip-toggle'}
                onClick={() => setClima(c)}
              >
                {CLIMA_EMOJI[c]} {CLIMA_LABEL[c]}
              </button>
            ))}
          </div>

          <p className="field-label">Ocasión</p>
          <div className="chip-selector">
            {TODAS_FORMALIDADES.map((f) => (
              <button
                key={f}
                type="button"
                className={formalidad === f ? 'chip-toggle chip-toggle-activo' : 'chip-toggle'}
                onClick={() => setFormalidad(f)}
              >
                {FORMALIDAD_EMOJI[f]} {FORMALIDAD_LABEL[f]}
              </button>
            ))}
          </div>

          <button
            className="btn-primary btn-generar"
            onClick={generar}
            disabled={prendas.length === 0 || generando}
          >
            {generando ? (
              <>
                <Wand2 size={16} className="icono-girando" /> Armando looks…
              </>
            ) : outfits ? (
              <>
                <Shuffle size={16} /> Regenerar
              </>
            ) : (
              <>
                <Sparkles size={16} /> Proponer looks
              </>
            )}
          </button>

          {prendas.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icono">
                <Sparkles size={26} strokeWidth={1.6} />
              </div>
              <p>Cargá alguna prenda primero para poder armar looks.</p>
            </div>
          )}

          {outfits && outfits.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icono">
                <Sparkles size={26} strokeWidth={1.6} />
              </div>
              <p>No encontré prendas para ese clima y esa ocasión.</p>
              <span>Probá otra combinación o cargá más ropa con esos tags.</span>
            </div>
          )}

          <div className="outfits-lista">
            {outfits?.map((outfit, i) => (
              <div key={i} className="outfit-card entrada-animada" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="outfit-card-header">
                  <h3>
                    <span className="outfit-numero">{i + 1}</span> Look {i + 1}
                  </h3>
                  <button className="btn-heart" onClick={() => handleGuardar(outfit)} title="Guardar look">
                    <Heart size={16} />
                  </button>
                </div>
                <div className="garment-grid">
                  {outfit.prendas.map((p, idx) => (
                    <GarmentCard key={p.id} prenda={p} compacta indice={idx} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'guardados' && (
        <LooksGuardados prendas={prendas} loading={loadingLooks} looks={looks} />
      )}
    </div>
  );
}

function LooksGuardados({
  prendas,
  loading,
  looks,
}: {
  prendas: Prenda[];
  loading: boolean;
  looks: LookGuardado[];
}) {
  const toast = useToast();

  if (loading) return <SkeletonGrid cantidad={4} />;

  if (looks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icono">
          <Heart size={26} strokeWidth={1.6} />
        </div>
        <p>Todavía no guardaste ningún look.</p>
        <span>Cuando armes uno que te guste, tocá el corazón para guardarlo.</span>
      </div>
    );
  }

  return (
    <div className="outfits-lista">
      {looks.map((look, i) => {
        const prendasLook = prendasDeLook(look, prendas);
        return (
          <div key={look.id} className="outfit-card entrada-animada" style={{ animationDelay: `${i * 90}ms` }}>
            <div className="outfit-card-header">
              <h3>
                {CLIMA_EMOJI[look.clima]} {FORMALIDAD_EMOJI[look.formalidad]} {FORMALIDAD_LABEL[look.formalidad]}
              </h3>
              <button
                className="btn-heart btn-heart-activo"
                title="Quitar de guardados"
                onClick={async () => {
                  try {
                    await eliminarLook(look);
                    toast.info('Look quitado de guardados');
                  } catch {
                    toast.error('No se pudo quitar el look');
                  }
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
            {prendasLook.length === 0 ? (
              <p className="page-subtitle">Las prendas de este look ya no están en tu armario.</p>
            ) : (
              <div className="garment-grid">
                {prendasLook.map((p, idx) => (
                  <GarmentCard key={p.id} prenda={p} compacta indice={idx} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
