import { useState, useEffect } from "react";
import { createTarea, getTarea, updateTarea } from "../api/tareas";
import { useAuth } from "../context/AuthContext";

function TareaForm({ actualizar, tareaSeleccionada, onTaskChanged }) {
  const [titulo, setTitulo] = useState("");
  const { token } = useAuth(); // ✅ usamos el token

  // Cargar la tarea seleccionada para editar
  useEffect(() => {
    const cargarTarea = async () => {
      if (tareaSeleccionada) {
        try {
          const res = await getTarea(tareaSeleccionada.id, token); // ✅ token
          setTitulo(res.data.titulo);
        } catch (err) {
          console.error("Error al obtener tarea:", err);
        }
      } else {
        setTitulo("");
      }
    };
    cargarTarea();
  }, [tareaSeleccionada, token]);

  // Guardar o actualizar tarea
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tareaSeleccionada) {
        await updateTarea(tareaSeleccionada.id, { titulo }, token); // ✅ token
      } else {
        await createTarea({ titulo }, token); // ✅ token
      }
      setTitulo("");
      onTaskChanged(); // Notifica al padre para refrescar
    } catch (err) {
      console.error("Error al guardar tarea:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Escribe una tarea"
        required
      />
      <button type="submit">{tareaSeleccionada ? "Actualizar" : "Guardar"}</button>
    </form>
  );
}

export default TareaForm;
