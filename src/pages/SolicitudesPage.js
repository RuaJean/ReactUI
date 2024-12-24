import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';

const SolicitudesPage = () => {
  const { user } = useContext(AuthContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('abierta');
  const [idEmpleado, setIdEmpleado] = useState('');
  const [error, setError] = useState('');

  const fetchSolicitudes = async () => {
    try {
      const res = await axiosClient.get('/api/solicitudes');
      setSolicitudes(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar solicitudes');
    }
  };

  const crearSolicitud = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/solicitudes', {
        descripcion,
        estado,
        id_empleado: Number(idEmpleado)
      });
      setDescripcion('');
      setEstado('abierta');
      setIdEmpleado('');
      fetchSolicitudes();
    } catch (err) {
      console.error(err);
      setError('Error al crear solicitud (solo admin)');
    }
  };

  const eliminarSolicitud = async (id) => {
    try {
      await axiosClient.delete(`/api/solicitudes/${id}`);
      fetchSolicitudes();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar solicitud (solo admin)');
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  return (
    <div className="container">
      <h2>Solicitudes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="list-container">
        {solicitudes.map(sol => (
          <div key={sol.id} className="list-item">
            <strong>{sol.descripcion}</strong> - {sol.estado} (Empleado #{sol.id_empleado})
            {user?.rol === 'administrador' && (
              <button
                onClick={() => eliminarSolicitud(sol.id)}
                className="button logout-btn"
                style={{ float: 'right' }}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>

      {user?.rol === 'administrador' && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Crear Solicitud</h3>
          <form onSubmit={crearSolicitud}>
            <div className="form-group">
              <label>Descripción:</label>
              <input
                type="text"
                value={descripcion}
                placeholder="Describe la solicitud"
                onChange={e => setDescripcion(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Estado:</label>
              <select value={estado} onChange={e => setEstado(e.target.value)}>
                <option value="abierta">abierta</option>
                <option value="cerrada">cerrada</option>
              </select>
            </div>

            <div className="form-group">
              <label>ID Empleado:</label>
              <input
                type="number"
                value={idEmpleado}
                placeholder="ID del empleado"
                onChange={e => setIdEmpleado(e.target.value)}
                required
              />
            </div>

            <button className="button" type="submit">Crear</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SolicitudesPage;
