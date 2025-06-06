import { useState } from "react";
import { registrarUsuario } from "../api/auth";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarUsuario(email, password);
      alert("Usuario registrado correctamente");
    } catch (err) {
      alert("Error al registrarse");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default RegisterForm;
