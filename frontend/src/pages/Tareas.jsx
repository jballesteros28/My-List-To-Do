import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteAccount from "../components/DeleteAccount";
import NeuButton from "../components/NeuButton";
import "../styles/Tareas.css"

function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();



  const getToken = () => localStorage.getItem("token");

  // Cargar tareas del usuario
  const fetchTareas = async () => {
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tareas/`, {
        headers: { Authorization: "Bearer " + getToken() },
      });
      if (!res.ok) throw new Error("No autorizado");
      const data = await res.json();
      setTareas(data);
    } catch (err) {
      setError("Error cargando tareas");
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  // Agregar nueva tarea
  const agregarTarea = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
        body: JSON.stringify({ titulo }),
      });
      if (!res.ok) throw new Error("No autorizado");
      setTitulo("");
      fetchTareas();
    } catch {
      setError("Error agregando tarea");
    }
  };

  // Eliminar tarea
  const eliminarTarea = async (id) => {
    try {
      const res = await fetch(`${API_URL}${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + getToken() },
      });
      if (!res.ok) throw new Error("No autorizado");
      setTareas(tareas.filter((t) => t.id !== id));
    } catch {
      setError("Error eliminando tarea");
    }
  };

  // Editar tarea
  const iniciarEdicion = (id, titulo) => {
    setEditId(id);
    setEditTitulo(titulo);
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditTitulo("");
  };

  const guardarEdicion = async (id) => {
    try {
      const res = await fetch(`${API_URL}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
        body: JSON.stringify({ titulo: editTitulo }),
      });
      if (!res.ok) throw new Error("No autorizado");
      fetchTareas();
      cancelarEdicion();
    } catch {
      setError("Error editando tarea");
    }
  };
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }


  return (
    <div className="tareas-wrapper">
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <NeuButton onClick={handleLogout}>Cerrar sesión</NeuButton>
        <DeleteAccount />
      </div>
      <h2 className="tareas-title">Lista de Tareas</h2>
      <form className="tareas-form" onSubmit={agregarTarea}>
        <input
          className="tarea-input"
          placeholder="Escribí una tarea"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <button className="tarea-btn agregar-btn" type="submit">
          Agregar
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="tareas-list">
        {tareas.map((t) => (
          <div className="tarea-item" key={t.id}>
            {editId === t.id ? (
              <>
                <input
                  className="tarea-input"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                />
                <button
                  className="tarea-btn editar-btn"
                  onClick={() => guardarEdicion(t.id)}
                >
                  Guardar
                </button>
                <button className="tarea-btn cancelar-btn" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="tarea-titulo">{t.titulo}</span>
                <button
                  className="tarea-btn editar-btn"
                  onClick={() => iniciarEdicion(t.id, t.titulo)}
                >
                  Editar
                </button>
                <button
                  className="tarea-btn eliminar-btn"
                  onClick={() => eliminarTarea(t.id)}
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tareas;
