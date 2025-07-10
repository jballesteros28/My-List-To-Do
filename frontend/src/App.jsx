import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tareas from "./pages/Tareas";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResendConfirmation from "./pages/ResendConfirmation";

// Componente para proteger rutas (solo si hay token en localStorage)
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tareas"
          element={
            <PrivateRoute>
              <Tareas />
            </PrivateRoute>
          }
        />
        {/* Redireccionar raíz a tareas si está logueado, sino a login */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/tareas" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Cualquier ruta inválida va a login o tareas */}
        <Route
          path="*"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/tareas" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/resend-confirmation" element={<ResendConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
