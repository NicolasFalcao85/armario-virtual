import { useMemo, useState } from 'react';
import { Layers, Moon, Shirt, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { eliminarPrenda, marcarUso, useWardrobe } from '../hooks/useWardrobe';
import { WardrobeGrid } from '../components/WardrobeGrid';
import { SkeletonGrid } from '../components/Skeleton';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { CATEGORIA_LABEL } from '../lib/labels';
import type { Prenda } from '../types';

const DIA_MS = 24 * 60 * 60 * 1000;

export function WardrobePage() {
  const { user } = useAuth();
  const { prendas, loading } = useWardrobe(user?.uid);
  const toast = useToast();
  const [aEliminar, setAEliminar] = useState<Prenda | null>(null);

  const primerNombre = user?.displayName?.split(' ')[0];

  const categoriaTop = useMemo(() => {
    if (prendas.length === 0) return null;
    const conteo = new Map<string, number>();
    for (const p of prendas) conteo.set(p.categoria, (conteo.get(p.categoria) ?? 0) + 1);
    const [cat] = [...conteo.entries()].sort((a, b) => b[1] - a[1])[0];
    return cat as keyof typeof CATEGORIA_LABEL;
  }, [prendas]);

  const categoriasDistintas = useMemo(
    () => new Set(prendas.map((p) => p.categoria)).size,
    [prendas],
  );

  const olvidadas = useMemo(() => {
    const ahora = Date.now();
    return prendas.filter((p) => {
      const referencia = p.ultimoUso ?? p.creadoEn;
      return ahora - referencia > 30 * DIA_MS;
    });
  }, [prendas]);

  async function confirmarEliminar() {
    if (!aEliminar) return;
    try {
      await eliminarPrenda(aEliminar);
      toast.success(`"${aEliminar.nombre}" eliminada`);
    } catch {
      toast.error('No se pudo eliminar la prenda');
    } finally {
      setAEliminar(null);
    }
  }

  async function handleMarcarUso(prenda: Prenda) {
    try {
      await marcarUso(prenda);
      toast.success(`"${prenda.nombre}" +1 uso 🔁`);
    } catch {
      toast.error('No se pudo registrar el uso');
    }
  }

  return (
    <div>
      {!loading && prendas.length > 0 && (
        <div className="hero-bento">
          <div className="hero-card">
            <h2>Hola{primerNombre ? `, ${primerNombre}` : ''} 👋</h2>
            <p>
              Tenés {prendas.length} prenda{prendas.length === 1 ? '' : 's'} catalogadas. Pedile un
              look a tu estilista cuando quieras.
            </p>
          </div>
          <div className="stat-tile">
            <Shirt size={16} />
            <div>
              <strong>{prendas.length}</strong>
              <span>prendas</span>
            </div>
          </div>
          <div className="stat-tile">
            <Layers size={16} />
            <div>
              <strong>{categoriasDistintas}</strong>
              <span>categorías</span>
            </div>
          </div>
          {categoriaTop && (
            <div className="stat-tile">
              <Sparkles size={16} />
              <div>
                <strong>{CATEGORIA_LABEL[categoriaTop]}</strong>
                <span>la más cargada</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && olvidadas.length > 0 && (
        <div className="nudge-card">
          <div className="nudge-icono">
            <Moon size={17} />
          </div>
          <div>
            <strong>
              {olvidadas.length} prenda{olvidadas.length === 1 ? '' : 's'} durmiendo hace más de 30 días
            </strong>
            <span>Pedile a tu estilista un look que las rescate.</span>
          </div>
        </div>
      )}

      <div className="page-heading">
        <h2>Mi armario</h2>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : (
        <WardrobeGrid prendas={prendas} onEliminar={setAEliminar} onMarcarUso={handleMarcarUso} />
      )}

      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo="¿Eliminar esta prenda?"
        descripcion={
          aEliminar ? `"${aEliminar.nombre}" se va a borrar de tu armario y no se puede deshacer.` : ''
        }
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </div>
  );
}
