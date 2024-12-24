import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute
 * @param {boolean} requiredAdmin - Indica si se requiere rol 'administrador'
 */
const ProtectedRoute = ({ children, requiredAdmin = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredAdmin && user.rol !== 'administrador') {
    return <div>No tienes permisos para acceder a esta sección.</div>;
  }

  return children;
};

export default ProtectedRoute;
