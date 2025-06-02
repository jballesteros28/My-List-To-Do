import { useState } from "react";
import TareaForm from "./components/TareaForm";
import TareaList from "./components/TareaList";

function App() {
  const [actualizar, setActualizar] = useState(false);

  const refrescarLista = () => setActualizar(!actualizar);

  return (
    <div>
      <h1>Lista de Tareas</h1>
      <TareaForm onTaskCreated={refrescarLista} />
      <TareaList key={actualizar} />
    </div>
  );
}

export default App;