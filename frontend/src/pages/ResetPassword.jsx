import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NeuInput from "../components/NeuInput";
import NeuButton from "../components/NeuButton";

/**
 * Pantalla para validar el código y luego permitir el cambio de contraseña.
 */
function ResetPassword() {
  // Si llegaste desde ForgotPassword, puedes tomar username/email del estado de navegación
  const location = useLocation();
  const initialUsername = location.state?.username || "";
  const initialEmail = location.state?.email || "";

  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [otpValid, setOtpValid] = useState(false); // Nuevo estado para el paso
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckOtp = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  try {
    const res = await fetch("https://my-list-to-do.onrender.com/auth/validate-reset-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim(),
        otp: otp.trim()
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setOtpValid(true);
      setMessage("Código correcto, ahora puedes ingresar una nueva contraseña.");
    } else {
      setMessage(data.detail || "Código incorrecto o expirado.");
    }
  } catch (err) {
    setMessage("Error de conexión con el servidor.");
  }
  setLoading(false);
};


  // Paso 2: Cambiar contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://my-list-to-do.onrender.com/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          otp: otp.trim(),
          new_password: newPassword
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("¡Contraseña cambiada correctamente! Ahora puedes iniciar sesión.");
        setTimeout(() => navigate("/login"), 2000);
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
    <div>
      <h2>Restablecer contraseña</h2>
      {!otpValid ? (
        <form onSubmit={handleCheckOtp}>
          <label>
            Usuario:
            <NeuInput
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              placeholder="Tu usuario"
            />
          </label>
          <label>
            Email registrado:
            <NeuInput
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Tu email"
            />
          </label>
          <label>
            Código recibido:
            <NeuInput
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              maxLength={6}
              pattern="[0-9]{6}"
              placeholder="Código de 6 dígitos"
            />
          </label>
          <NeuButton type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Verificar código"}
          </NeuButton>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <label>
            Nueva contraseña:
            <NeuInput
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Nueva contraseña"
            />
          </label>
          <label>
            Confirmar nueva contraseña:
            <NeuInput
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Confirmar contraseña"
            />
          </label>
          <NeuButton type="submit" disabled={loading}>
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </NeuButton>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;

