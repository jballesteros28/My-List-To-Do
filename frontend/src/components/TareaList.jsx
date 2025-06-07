import { useEffect, useState } from "react";
import { getTareas, deleteTarea } from "../api/tareas";
import { useAuth } from "../context/AuthContext"; // ✅ Importar contexto
import "../styles/List.css";

function TareaList({ actualizar, onEditClick, onTaskChanged }) {
  const [tareas, setTareas] = useState([]);
  const { token } = useAuth(); // ✅ Obtener token

  const cargarTareas = async () => {
    try {
      const res = await getTareas(token); // ✅ Usar token
      setTareas(res.data);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  useEffect(() => {
    if (token) {
      cargarTareas();
    }
  }, [actualizar, token]);

  const handleDelete = async (id) => {
    try {
      await deleteTarea(id, token); // ✅ Usar token
      cargarTareas();
      onTaskChanged();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  return (
    <ul>
      {tareas.map((tarea) => (
        <li key={tarea.id}>
          <span className="tarea-texto">{tarea.titulo}</span>
          <div className="acciones">
            <button onClick={() => onEditClick(tarea)}>Editar</button>
            <button onClick={() => handleDelete(tarea.id)}>Eliminar</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TareaList;
