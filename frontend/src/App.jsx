import { useState } from "react";
import TareaForm from "./components/TareaForm";
import TareaList from "./components/TareaList";
import "./styles/App.css";

function App() {
  const [actualizar, setActualizar] = useState(false);
  const [tareaActual, setTareaActual] = useState(null); // 👈 NUEVO

  const refrescarLista = () => setActualizar(!actualizar);

  return (
    <div className="app-container">
      <h1>Lista de Tareas</h1>
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
    </div>
  );
}

export default App;