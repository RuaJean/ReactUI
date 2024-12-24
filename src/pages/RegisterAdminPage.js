import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

const RegisterAdminPage = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegisterAdmin = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/auth/register-admin', {
        nombre,
        email,
        password
      });
      setMessage('¡Admin registrado exitosamente!');
      setError('');
      setNombre('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
      setError('Error al registrar admin');
      setMessage('');
    }
  };

  return (
    <div className="container">
      <h2>Registrar Admin</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleRegisterAdmin}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre de admin"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="admin@correo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="*******"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="button" type="submit">Registrar Admin</button>
      </form>
    </div>
  );
};

export default RegisterAdminPage;
