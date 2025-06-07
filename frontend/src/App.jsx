import { useState } from "react";
import TareaForm from "./components/TareaForm";
import TareaList from "./components/TareaList";
import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm"; 
import "./styles/App.css";

function App() {
  const [actualizar, setActualizar] = useState(false);
  const [tareaActual, setTareaActual] = useState(null);

  const refrescarLista = () => setActualizar(!actualizar);
  const { token } = useAuth();

  return (
    <div className="app-container">
      <h1>Lista de Tareas</h1>
      {!token ? (
      <LoginForm /> // Muestra el login si no hay token
    ) : (
      <>
        <TareaForm
          onTaskSaved={refrescarLista}
          tareaActual={tareaActual}
          setTareaActual={setTareaActual}
        />
        <TareaList
          actualizar={actualizar}
          onEditClick={(tarea) => setTareaActual(tarea)}
          onTaskChanged={refrescarLista}
        />
      </>
    )}
    </div>
  );
}

export default App;