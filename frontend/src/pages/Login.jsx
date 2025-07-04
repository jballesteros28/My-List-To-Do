import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NeuInput from '../components/NeuInput';
import NeuButton from '../components/NeuButton';
import '../styles/Auth.css';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new URLSearchParams();
      formData.append('username', form.username);
      formData.append('password', form.password);

      const response = await fetch("https://my-list-to-do.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        let errMsg = "";
        if (Array.isArray(data.detail)) {
          errMsg = data.detail.map(e => e.msg).join(", ");
        } else {
          errMsg = data.detail || "Error desconocido";
        }
        setError(errMsg);
        return;
      }
      localStorage.setItem("token", data.access_token);
      navigate("/tareas");

    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <NeuInput
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={handleChange}
        />
        <NeuInput
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />
        <NeuButton>Ingresar</NeuButton>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        ¿No tienes una cuenta? <Link to="/register">Registrarse</Link>
      </p>
      <div className="auth-link">
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </div>
    </div>
  );
};

export default Login;

