import React from "react";
import DarkModeToggle from "./DarkModeToggle";

function extractHadithText(fullText) {
  if (fullText.length > 150) {
    const splitIndex = fullText.indexOf('"');
    if (splitIndex !== -1) {
      return fullText.slice(splitIndex).trim();
    }
    return fullText;
  }
}

function FavoritesView({
  favorites,
  darkMode,
  setDarkMode,
  hadiths,
  index,
  currentView,
  setDayOffset,
  setCurrentView,
}) {
  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "'Arial', sans-serif",
        maxWidth: 900,
        margin: "auto",
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1 style={{ fontWeight: "bold", fontSize: "2rem" }}>Favorites</h1>
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

        {favorites.length === 0 && (
          <div
            style={{
              marginTop: "2rem",
              padding: "2rem",
              backgroundColor: darkMode ? "#333" : "#f8f9fa",
              borderRadius: "8px",
              border: darkMode ? "1px solid #555" : "1px solid #e9ecef",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⭐</div>
            <h3
              style={{
                marginBottom: "1rem",
                color: darkMode ? "#fff" : "#333",
                fontSize: "1.2rem",
              }}
            >
              No favorites yet
            </h3>
            <p
              style={{
                color: darkMode ? "#bbb" : "#666",
                lineHeight: "1.6",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              Start building your personal collection! When you find a hadith
              that speaks to you, tap the <strong>★ Star</strong> button to save
              it here. Your favorites will be available offline and you can
              return to them anytime by clicking on them.
            </p>
          </div>
        )}
      </header>

      <ul
        style={{
          listStyle: "none",
          paddingLeft: 0,
          maxHeight: "70vh",
          overflowY: "auto",
          borderTop: darkMode ? "1px solid #ddd" : "1px solid #444",
        }}
      >
        {favorites.map((fav) => {
          const hadithOnly = extractHadithText(fav.arabic);
          return (
            <li
              key={fav.id}
              style={{
                marginBottom: "1.5rem",
                paddingTop: "1rem",
                borderBottom: darkMode ? "1px solid #ddd" : "1px solid #444",
              }}
            >
              <button
                onClick={() => {
                  // Always use the real current date, not offsetDate
                  const hadithsStartDate = new Date("2024-12-31");
                  const today = new Date();
                  const todayDaySinceStart = Math.floor(
                    (today - hadithsStartDate) / (1000 * 60 * 60 * 24)
                  );
                  const favIndex = hadiths.findIndex((h) => h.id === fav.id);
                  const offset = favIndex - todayDaySinceStart;

                  // Only change if not already showing this hadith
                  if (index !== favIndex || currentView !== "hadith") {
                    setDayOffset(offset);
                    setCurrentView("hadith");
                    setTimeout(
                      () => window.scrollTo({ top: 0, behavior: "smooth" }),
                      100
                    );
                  }
                }}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  color: darkMode ? "#007acc" : "#66aaff",
                  textDecoration: "underline",
                  fontSize: "1.1rem",
                  padding: 0,
                  display: "block",
                  textAlign: "left",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = darkMode
                    ? "#005a99"
                    : "#4488cc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = darkMode
                    ? "#007acc"
                    : "#66aaff")
                }
                aria-label={`View hadith: ${hadithOnly.slice(0, 30)}...`}
              >
                <span style={{ direction: "rtl", unicodeBidi: "plaintext" }}>
                  {hadithOnly.length > 130
                    ? hadithOnly.slice(0, 130) + "..."
                    : hadithOnly}
                </span>
              </button>
              <small
                style={{
                  color: darkMode ? "#666" : "#bbb",
                  display: "block",
                  marginTop: "0.3rem",
                  fontSize: "0.85rem",
                  fontStyle: "italic",
                }}
              >
                Book ID: {fav.bookId}, Chapter ID: {fav.chapterId}
              </small>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FavoritesView;
