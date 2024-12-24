import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Paginas no lazy (pequeñas)
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';

// Lazy load de páginas más pesadas
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const RegisterAdminPage = lazy(() => import('./pages/RegisterAdminPage'));
const EmpleadosPage = lazy(() => import('./pages/EmpleadosPage'));
const SolicitudesPage = lazy(() => import('./pages/SolicitudesPage'));

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Registrar Admin => solo admin */}
          <Route
            path="/admin/register-admin"
            element={
              <ProtectedRoute requiredAdmin={true}>
                <RegisterAdminPage />
              </ProtectedRoute>
            }
          />

          {/* Empleados => requiere login (rol administrador o empleado) */}
          <Route
            path="/empleados"
            element={
              <ProtectedRoute>
                <EmpleadosPage />
              </ProtectedRoute>
            }
          />

          {/* Solicitudes => requiere login (rol administrador o empleado) */}
          <Route
            path="/solicitudes"
            element={
              <ProtectedRoute>
                <SolicitudesPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
