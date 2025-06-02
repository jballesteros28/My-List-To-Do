import { useEffect, useState } from "react";
import { getTareas, deleteTarea } from "../api/tareas";
import "../styles/List.css";

function TareaList({ actualizar, onEditClick, onTaskChanged }) {
  const [tareas, setTareas] = useState([]);

  const cargarTareas = async () => {
    const res = await getTareas();
    setTareas(res.data);
  };

  useEffect(() => {
    cargarTareas();
  }, [actualizar]);

  const handleDelete = async (id) => {
    await deleteTarea(id);
    cargarTareas();
    onTaskChanged();
  };

  return (
    <ul>
      {tareas.map((tarea) => (
        <li key={tarea.id}>
          <span>{tarea.titulo}</span>
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