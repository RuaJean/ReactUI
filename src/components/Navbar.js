import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="navbar-logo">Konecta</div>

      <nav className="navbar-links">
        <Link to="/" className="navbar-item">Inicio</Link>

        {user && (
          <>
            <Link to="/empleados" className="navbar-item">Empleados</Link>
            <Link to="/solicitudes" className="navbar-item">Solicitudes</Link>
          </>
        )}

        {user?.rol === 'administrador' && (
          <Link to="/admin/register-admin" className="navbar-item">
            Registrar Admin
          </Link>
        )}

        {user ? (
          <button onClick={logout} className="button logout-btn">
            Cerrar Sesión
          </button>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Iniciar Sesión</Link>
            <Link to="/register" className="navbar-item">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
