// src/components/NeuModal.jsx
import React from "react";

export default function NeuModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#f4f4f8",
          boxShadow: "0 6px 24px rgba(0,0,0,0.18), 0 1.5px 4.5px rgba(0,0,0,0.14)",
          borderRadius: "24px",
          minWidth: "340px",
          padding: "2rem",
          position: "relative"
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute", top: 12, right: 18, background: "transparent",
            border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#888"
          }}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
