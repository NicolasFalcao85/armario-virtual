import { AlertTriangle } from 'lucide-react';

interface Props {
  abierto: boolean;
  titulo: string;
  descripcion: string;
  textoConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({
  abierto,
  titulo,
  descripcion,
  textoConfirmar = 'Eliminar',
  onConfirmar,
  onCancelar,
}: Props) {
  if (!abierto) return null;

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <div className="modal-icono">
          <AlertTriangle size={22} />
        </div>
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
        <div className="modal-acciones">
          <button className="btn-secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="btn-peligro" onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
