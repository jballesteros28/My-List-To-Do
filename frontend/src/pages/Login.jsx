import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NeuInput from '../components/NeuInput';
import NeuButton from '../components/NeuButton';
import NeuModal from '../components/NeuModal';              // <--- Nuevo import
import ResendConfirmation from './ResendConfirmation';
import '../styles/Auth.css';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showResendModal, setShowResendModal] = useState(false);  // <--- Nuevo estado
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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
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
        // Si el error es por cuenta no confirmada, muestra el modal
        if (
          errMsg.toLowerCase().includes("confirmar tu correo") ||
          errMsg.toLowerCase().includes("cuenta no confirmada")
        ) {
          setShowResendModal(true);
        }
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
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button
          type="button"
          onClick={() => setShowResendModal(true)}
          style={{
            background: "none",
            border: "none",
            color: "#7d6efc",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          ¿No recibiste el correo de confirmación?
        </button>
      </div>

      {/* MODAL de reenviar confirmación */}
      <NeuModal isOpen={showResendModal} onClose={() => setShowResendModal(false)}>
        <ResendConfirmation onClose={() => setShowResendModal(false)} />
      </NeuModal>
    </div>
  );
};

export default Login;


