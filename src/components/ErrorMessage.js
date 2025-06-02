import React from "react";

function ErrorMessage({ error }) {
  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        color: "red",
      }}
    >
      <p>Error: {error}</p>
      <button
        onClick={() => window.location.reload()}
        style={{
          cursor: "pointer",
          padding: "0.5rem 1rem",
          borderRadius: 5,
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
        }}
      >
        Retry
      </button>
    </div>
  );
}

export default ErrorMessage;
