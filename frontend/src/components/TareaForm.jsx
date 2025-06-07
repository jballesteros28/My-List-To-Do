import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createTarea, updateTarea } from "../api/tareas";
import "../styles/Form.css";

function TareaForm({ onTaskSaved, tareaActual, setTareaActual }) {
  const [titulo, setTitulo] = useState("");

  useEffect(() => {
    if (tareaActual) {
      setTitulo(tareaActual.titulo);
    } else {
      setTitulo("");
    }
  }, [tareaActual]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    try {
    await createTarea({ titulo }, token); // ✅ enviamos el token
    setTitulo("");
    onTaskSaved(); // refrescar lista
  } catch (err) {
    console.error("Error al guardar tarea:", err);
  }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Escribí una tarea"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <button type="submit">{tareaActual ? "Actualizar" : "Agregar"}</button>
      {tareaActual && (
        <button type="button" onClick={() => setTareaActual(null)}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default TareaForm;