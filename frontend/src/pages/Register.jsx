import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NeuInput from '../components/NeuInput';
import NeuButton from '../components/NeuButton';
import '../styles/Auth.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [retrying, setRetrying] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setRetrying(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      // --- Lógica para errores específicos ---
      if (!response.ok) {
        // Mensaje para usuario/email ya registrado y activo
        if (
          data.detail === 'El email ya está registrado' ||
          data.detail === 'El nombre de usuario ya está registrado'
        ) {
          setError(data.detail);
        } else {
          // En el backend, cuando usuario/email estaban INACTIVOS, el registro se permite normalmente y se borra el registro anterior. Así que cualquier otro error se muestra:
          setError(data.detail || 'Error al registrar');
        }
        return;
      }

      // --- Si fue exitoso ---
      setSuccess('Registro exitoso. ¡Confirma tu cuenta antes de iniciar sesión!');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <NeuInput
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={handleChange}
        />
        <NeuInput
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
        />
        <NeuInput
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />
        <NeuButton>Registrarse</NeuButton>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <p>
        ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </div>
  );
};

export default Register;
