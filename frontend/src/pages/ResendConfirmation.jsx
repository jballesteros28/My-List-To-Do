import { useState } from "react";
import { useLocation } from "react-router-dom";
import NeuInput from "../components/NeuInput";
import NeuButton from "../components/NeuButton";

function ResendConfirmation() {
  const location = useLocation();
  // Permite autocompletar el mail si vienes del login
  const [email, setEmail] = useState(location.state?.email || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/resend-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.msg || "Correo enviado. Revisa tu email.");
      } else {
        setMessage(data.detail || "Error al reenviar el correo.");
      }
    } catch (err) {
      setMessage("Error de red. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="resend-confirmation-container" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center"
    }}>
      <form onSubmit={handleResend} style={{ textAlign: "center", maxWidth: 340, width: "100%" }}>
        <h3>Reenviar correo de confirmación</h3>
        <NeuInput
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="Tu correo"
          autoFocus
          style={{ marginBottom: "1rem" }}
        />
        <div style={{ margin: "1rem 0" }}>
          <NeuButton type="submit" disabled={loading || !email}>
            {loading ? "Enviando..." : "Reenviar"}
          </NeuButton>
        </div>
        {message && <p style={{ margin: "1rem 0", color: "#4b4b4b" }}>{message}</p>}
      </form>
    </div>
  );
}

export default ResendConfirmation;
