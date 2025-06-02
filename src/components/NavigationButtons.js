import React from "react";

function NavigationButtons({
  darkMode,
  windowWidth,
  prevHadith,
  nextHadith,
  toggleFavorite,
  isFavorite,
  dayOffset,
}) {
  const btnStyle = {
    cursor: "pointer",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: 6,
    fontWeight: "bold",
    backgroundColor: darkMode ? "#333333cc" : "#007bffcc",
    color: darkMode ? "#eee" : "#fff",
    userSelect: "none",
    margin: "0 0.3rem",
  };

  const isCompact = windowWidth < 480;

  return (
    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
      <div
        style={{
          position: "fixed",
          bottom: "5vh",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "0 1rem",
          zIndex: 999,
        }}
      >
        <button
          onClick={prevHadith}
          style={btnStyle}
          aria-label="Previous Hadith"
        >
          {isCompact ? "⬅️" : "← Previous"}
        </button>

        <button
          onClick={toggleFavorite}
          style={{
            ...btnStyle,
            backgroundColor: isFavorite
              ? "#ffc107cc"
              : btnStyle.backgroundColor,
            color: isFavorite ? "#333" : btnStyle.color,
            minWidth: isCompact ? 75 : 150,
          }}
          aria-label="Toggle Favorite"
        >
          {isCompact
            ? isFavorite
              ? "★"
              : "☆"
            : isFavorite
            ? "★ Favorited"
            : "☆ Add to Favorites"}
        </button>

        <button
          onClick={nextHadith}
          disabled={dayOffset === 0}
          style={{
            ...btnStyle,
            opacity: dayOffset === 0 ? 0.5 : 1,
          }}
          aria-label="Next Hadith"
        >
          {isCompact ? "➡️" : "Next →"}
        </button>
      </div>
    </div>
  );
}

export default NavigationButtons;
