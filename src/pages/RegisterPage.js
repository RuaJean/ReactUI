import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/auth/register', {
        nombre,
        email,
        password
      });
      setMessage('¡Usuario registrado exitosamente!');
      setError('');
      setNombre('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
      setError('Error al registrar usuario');
      setMessage('');
    }
  };

  return (
    <div className="container">
      <h2>Registro de Usuario</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
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

        <button className="button" type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterPage;
