import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';

const EmpleadosPage = () => {
  const { user } = useContext(AuthContext); 
  const [empleados, setEmpleados] = useState([]);
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [error, setError] = useState('');

  const fetchEmpleados = async () => {
    try {
      const res = await axiosClient.get('/api/empleados');
      setEmpleados(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar empleados');
    }
  };

  const crearEmpleado = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/empleados', {
        nombre,
        puesto
      });
      setNombre('');
      setPuesto('');
      fetchEmpleados();
    } catch (err) {
      console.error(err);
      setError('Error al crear empleado (solo admin)');
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  return (
    <div className="container">
      <h2>Empleados</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="list-container">
        {empleados.map(emp => (
          <div key={emp.id} className="list-item">
            <strong>{emp.nombre}</strong> - {emp.puesto}
          </div>
        ))}
      </div>

      {user?.rol === 'administrador' && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Crear Empleado</h3>
          <form onSubmit={crearEmpleado}>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                placeholder="Nombre del empleado"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Puesto:</label>
              <input
                type="text"
                placeholder="Puesto del empleado"
                value={puesto}
                onChange={e => setPuesto(e.target.value)}
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

export default EmpleadosPage;
