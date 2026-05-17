import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from './context/AuthContext';
import { PageSpinner } from './components/ui/Spinner';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import CatalogoPage from './pages/CatalogoPage';
import RecetaPage from './pages/RecetaPage';
import ListaPage from './pages/ListaPage';
import FavoritasPage from './pages/FavoritasPage';
import PlanificadorPage from './pages/PlanificadorPage';
import ProfilePage from './pages/ProfilePage';

// Ruta protegida
function PrivateRoute({ children }) {
  const { usuario, loading } = useAuth();
  if (loading) return <PageSpinner />;
  if (!usuario) return <Navigate to="/login" replace />;
  if (!usuario.onboarding_done) return <Navigate to="/onboarding" replace />;
  return children;
}

function ProductLayout() {
  const [search, setSearch] = useState('');

  return <AppShell searchValue={search} onSearchChange={setSearch} />;
}

export default function App() {
  const { loading } = useAuth();
  if (loading) return <PageSpinner />;

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route
          element={
            <PrivateRoute>
              <ProductLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/recetas/:id" element={<RecetaPage />} />
          <Route path="/lista" element={<ListaPage />} />
          <Route path="/favoritas" element={<FavoritasPage />} />
          <Route path="/planificador" element={<PlanificadorPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#161513',
            border: '1px solid #E6E1D7',
            borderRadius: '8px',
            fontFamily: 'Geist, sans-serif',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
}
