import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { agregarPrenda } from '../hooks/useWardrobe';
import { AddGarmentForm } from '../components/AddGarmentForm';
import { useToast } from '../components/Toast';

export function AddGarmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div>
      <div className="page-heading">
        <h2>Agregar prenda</h2>
      </div>
      <AddGarmentForm
        onGuardar={async (datos) => {
          if (!user) return;
          const { foto, ...resto } = datos;
          await agregarPrenda(user.uid, resto, foto);
          toast.success(`"${resto.nombre}" agregada a tu armario`);
          navigate('/');
        }}
      />
    </div>
  );
}
