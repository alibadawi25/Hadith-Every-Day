import React from "react";

export default function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
      <button
        onClick={() => setDarkMode((d) => !d)}
        aria-label="Toggle dark mode"
        style={{
          cursor: "pointer",
          background: "none",
          border: "1px solid",
          borderRadius: 5,
          padding: "0.3rem 0.7rem",
          color: darkMode ? "#eee" : "#111",
          transition: "color 0.3s ease, border-color 0.3s ease",
        }}
      >
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  );
}
