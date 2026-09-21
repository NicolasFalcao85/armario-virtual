import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

type TipoToast = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  tipo: TipoToast;
  mensaje: string;
}

interface ToastContextValue {
  success: (mensaje: string) => void;
  error: (mensaje: string) => void;
  info: (mensaje: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONO: Record<TipoToast, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const quitar = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const mostrar = useCallback(
    (tipo: TipoToast, mensaje: string) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, tipo, mensaje }]);
      setTimeout(() => quitar(id), 3500);
    },
    [quitar],
  );

  const value: ToastContextValue = {
    success: (m) => mostrar('success', m),
    error: (m) => mostrar('error', m),
    info: (m) => mostrar('info', m),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => {
          const Icono = ICONO[t.tipo];
          return (
            <div key={t.id} className={`toast toast-${t.tipo}`}>
              <Icono size={18} />
              <span>{t.mensaje}</span>
              <button className="toast-cerrar" onClick={() => quitar(t.id)} aria-label="Cerrar">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}
