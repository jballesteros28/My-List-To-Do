import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NeuInput from "../components/NeuInput";
import NeuButton from "../components/NeuButton";


function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    console.log("Enviando:", { username, email });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), email: email.trim() }), // Envía ambos campos como json
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Revisa tu correo para el código de recuperación.");
        // Espera 1 segundo y navega a reset-password, pasando username y email
        setTimeout(() => {
          navigate("/reset-password", { state: { username, email } });
        }, 1000);
      } else {
        let errorMsg = "Hubo un error.";
        if (Array.isArray(data) && data[0]?.msg) {
          errorMsg = data.map(e => e.msg).join(", ");
        } else if (data.detail) {
          errorMsg = data.detail;
        }
        setMessage(errorMsg);
      }
    } catch (err) {
      setMessage("Error de conexión con el servidor.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>¿Olvidaste tu contraseña?</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Usuario:
          <NeuInput
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
            placeholder="Ingresa tu usuario"
          />
        </label>
        <label>
          Email registrado:
          <NeuInput
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Ingresa tu email"
          />
        </label>
        <NeuButton type="submit" disabled={loading}>
            {loading ? "Cambiando..." : "Cambiar contraseña"}
        </NeuButton>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
