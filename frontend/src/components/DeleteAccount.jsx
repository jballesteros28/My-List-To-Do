import { useState } from "react";
import NeuButton from "../components/NeuButton";
import { useNavigate } from "react-router-dom";
import "../styles/DeleteAcount.css"; 

function DeleteAccount() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.")) return;
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Cuenta eliminada correctamente.");
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.detail || "No se pudo eliminar la cuenta.");
      }
    } catch (err) {
      setMessage("Error de red. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="delete-account-container">
      <NeuButton
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? "Eliminando..." : "Eliminar mi cuenta"}
      </NeuButton>
      {message && (
        <div className="delete-message">{message}</div>
      )}
    </div>
  );
}

export default DeleteAccount;
