import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container">
      <h1>Bienvenido</h1>
      <p>Selecciona una opción en el menú para continuar.</p>

      {user && (
        <>
          <hr />
          <h3>Accesos directos</h3>
          <ul>
            <li>
              <Link to="/empleados">Empleados</Link>
            </li>
            <li>
              <Link to="/solicitudes">Solicitudes</Link>
            </li>
            {user.rol === 'administrador' && (
              <li>
                <Link to="/admin/register-admin">Registrar Admin</Link>
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default Dashboard;
