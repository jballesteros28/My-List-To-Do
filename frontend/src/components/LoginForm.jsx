import { useState } from "react";
import { loginUsuario } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUsuario(email, password);
      login(data.access_token);
      alert("Login exitoso");
    } catch (err) {
      alert("Error al iniciar sesión");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

export default LoginForm;