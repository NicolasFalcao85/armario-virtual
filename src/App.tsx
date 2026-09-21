import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { ToastProvider } from './components/Toast';
import { WardrobePage } from './pages/WardrobePage';
import { AddGarmentPage } from './pages/AddGarmentPage';
import { OutfitBuilderPage } from './pages/OutfitBuilderPage';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 size={28} className="icono-girando" />
      </div>
    );
  }
  if (!user) return <Login />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<WardrobePage />} />
          <Route path="/agregar" element={<AddGarmentPage />} />
          <Route path="/looks" element={<OutfitBuilderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}
