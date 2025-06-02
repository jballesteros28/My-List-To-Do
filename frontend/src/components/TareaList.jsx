import { useEffect, useState } from "react";
import { getTareas, deleteTarea } from "../api/tareas";

function TareaList() {
  const [tareas, setTareas] = useState([]);

  const cargarTareas = async () => {
    const res = await getTareas();
    setTareas(res.data);
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const handleDelete = async (id) => {
    await deleteTarea(id);
    cargarTareas();
  };

  return (
    <ul>
      {tareas.map((tarea) => (
        <li key={tarea.id}>
          {tarea.titulo}
          <button onClick={() => handleDelete(tarea.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
}

export default TareaList;