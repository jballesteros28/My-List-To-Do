import { useState } from "react";
import { createTarea } from "../api/tareas.js";

function TareaForm({ onTaskCreated }) {
  const [titulo, setTitulo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return; // evita enviar vacío

  try {
    await createTarea({ titulo }); // <- asegúrate que título es string válido
    setTitulo("");
    onTaskCreated();
  } catch (error) {
    console.error("Error al crear tarea:", error);
  }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nueva tarea"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <button type="submit">Agregar</button>
    </form>
    
  );
}

export default TareaForm;