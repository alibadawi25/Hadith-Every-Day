import React from "react";
import HadithItem from "./HadithItem";
import DarkModeToggle from "./DarkModeToggle";
import NavigationButtons from "./NavigationButtons";

function HadithView({
  hadith,
  gregorianString,
  hijriDate,
  darkMode,
  setDarkMode,
  windowWidth,
  prevHadith,
  nextHadith,
  toggleFavorite,
  isFavorite,
  dayOffset,
}) {
  return (
    <div>
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
        <h1
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontWeight: "bold",
            fontSize: "2rem",
          }}
        >
          كل يوم حديث
        </h1>
        <p
          style={{
            textAlign: "center",
            fontSize: "1.1rem",
            marginBottom: "0.5rem",
            fontWeight: "500",
          }}
        >
          Hadith For Date: {gregorianString}
        </p>
        <p
          style={{
            fontFamily: "'Amiri', serif",
            fontSize: "1.2rem",
            textAlign: "center",
            marginBottom: "2rem",
            fontWeight: "500",
          }}
        >
          📅 الحديث للتاريخ الهجري: {hijriDate}
        </p>
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "5rem",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 320,
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "1rem",
              boxShadow: darkMode
                ? "0 2px 6px rgba(255,255,255,0.1)"
                : "0 2px 6px rgba(0,0,0,0.1)",
              fontSize: "1.3rem",
              lineHeight: "1.6",
              fontFamily: "'Amiri', serif",
              direction: "rtl",
              backgroundColor: darkMode ? "#333" : "#fafafa",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
              النص العربي
            </h2>
            <HadithItem content={hadith.arabic} lang="rtl" />
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 320,
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "1rem",
              boxShadow: darkMode
                ? "0 2px 6px rgba(255,255,255,0.1)"
                : "0 2px 6px rgba(0,0,0,0.1)",
              fontSize: "1rem",
              lineHeight: "1.6",
              backgroundColor: darkMode ? "#333" : "#fafafa",
              color: darkMode ? "#eee" : "#333",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
              English Text
            </h2>
            <HadithItem content={hadith.english} lang="ltr" />
          </div>
        </div>

        <NavigationButtons
          darkMode={darkMode}
          windowWidth={windowWidth}
          prevHadith={prevHadith}
          nextHadith={nextHadith}
          toggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
          dayOffset={dayOffset}
        />
      </div>
    </div>
  );
}

export default HadithView;
