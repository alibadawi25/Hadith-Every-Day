import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import "antd/dist/reset.css";
import DarkModeToggle from "./components/DarkModeToggle";
import "./App.css"; // Your overrides

const { Header, Content } = Layout;
const LOCAL_STORAGE_FAVORITES_KEY = "hadith_favorites";

function extractHadithText(fullText) {
  if (fullText.length > 150) {
    const splitIndex = fullText.indexOf('"');
    if (splitIndex !== -1) {
      return fullText.slice(splitIndex).trim(); // +3 to skip `: "`
    }
    return fullText; // fallback if pattern not found
  }
}

function HadithItem({ content, lang = "ltr" }) {
  if (
    content &&
    typeof content === "object" &&
    ("narrator" in content || "text" in content)
  ) {
    return (
      <div style={{ marginBottom: "1.5rem", direction: lang }}>
        {content.narrator && (
          <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
            {content.narrator}
          </div>
        )}
        {content.text && (
          <div style={{ whiteSpace: "pre-wrap" }}>{content.text}</div>
        )}
      </div>
    );
  }

  if (typeof content === "object") {
    const textContent = Object.values(content).join(" ");
    return (
      <div
        style={{
          whiteSpace: "pre-wrap",
          direction: lang,
          marginBottom: "1.5rem",
        }}
      >
        {textContent}
      </div>
    );
  }

  return (
    <div
      style={{
        whiteSpace: "pre-wrap",
        direction: lang,
        marginBottom: "1.5rem",
      }}
    >
      {content}
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState("hadith");

  const [hadiths, setHadiths] = useState([]);
  const [dayOffset, setDayOffset] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const favs = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
    return favs ? JSON.parse(favs) : [];
  });

  useEffect(() => {
    fetch("/riyad_assalihin.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load hadith data");
        return res.json();
      })
      .then((data) => {
        if (!data.hadiths || data.hadiths.length === 0)
          throw new Error("No hadiths found in data");
        setHadiths(data.hadiths);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  if (loading)
    return (
      <div
        style={{
          padding: "2rem",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
        }}
      >
        Loading hadith...
      </div>
    );

  if (error)
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

  const today = new Date();
  const offsetDate = new Date(today);
  offsetDate.setDate(today.getDate() + dayOffset);
  const getDayOfYear = (date = new Date()) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const index =
    hadiths.length > 0 ? getDayOfYear(offsetDate) % hadiths.length : 0;
  const hadith = hadiths[index];
  if (index === null) return null;

  const gregorianString = offsetDate.toLocaleDateString("en-GB");

  const arabicMonths = [
    "محرم",
    "صفر",
    "ربيع الأول",
    "ربيع الآخر",
    "جمادى الأولى",
    "جمادى الآخرة",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذو القعدة",
    "ذو الحجة",
  ];

  // Format date using Intl to get Arabic digits
  const toArabicDigits = (n) =>
    new Intl.NumberFormat("ar-EG", { useGrouping: false }).format(n);

  const hijriDate = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(offsetDate);

  const isFavorite = favorites.some((fav) => fav.id === hadith.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== hadith.id));
    } else {
      setFavorites([...favorites, hadith]);
    }
  };

  const prevHadith = () => setDayOffset((prev) => prev - 1);

  const nextHadith = () => {
    if (dayOffset < 0) setDayOffset((prev) => prev + 1);
  };

  const btnStyle = {
    cursor: "pointer",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: 6,
    fontWeight: "bold",
    backgroundColor: darkMode ? "#333" : "#007bff",
    color: darkMode ? "#eee" : "#fff",
    userSelect: "none",
    margin: "0 0.3rem",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: darkMode ? "#fff" : "#001529", // typical antd dark header bg or white
          color: darkMode ? "#000" : "#fff",
        }}
      >
        <div
          style={{
            color: darkMode ? "#000" : "#fff", // text color for the title
            fontWeight: "bold",
            fontSize: 20,
            marginRight: 24,
          }}
        >
          Hadith App
        </div>
        <Menu
          theme={darkMode ? "light" : "dark"}
          mode="horizontal"
          selectedKeys={[currentView]}
          onClick={(e) => setCurrentView(e.key)}
          style={{ flex: 1 }}
        >
          <Menu.Item key="hadith">Hadith</Menu.Item>
          <Menu.Item key="favorites">Favorites</Menu.Item>
        </Menu>
      </Header>
      <Content
        style={{
          backgroundColor: darkMode ? "#222" : "#fefefe",
          color: darkMode ? "#eee" : "#111",
        }}
      >
        <div>
          {currentView === "hadith" && (
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
                    marginBottom: "2rem",
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
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <button
                    onClick={prevHadith}
                    style={btnStyle}
                    aria-label="Previous Hadith"
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={toggleFavorite}
                    style={{
                      ...btnStyle,
                      backgroundColor: isFavorite
                        ? "#ffc107"
                        : btnStyle.backgroundColor,
                      color: isFavorite ? "#333" : btnStyle.color,
                      minWidth: 150,
                    }}
                    aria-label="Toggle Favorite"
                  >
                    {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
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
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
          {currentView === "favorites" && (
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
                <h1 style={{ fontWeight: "bold", fontSize: "2rem" }}>
                  Favorites
                </h1>
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

                {favorites.length === 0 && (
                  <p
                    style={{
                      fontStyle: "italic",
                      marginTop: "1rem",
                      color: darkMode ? "#666" : "#bbb",
                    }}
                  >
                    You have no favorites saved yet.
                  </p>
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
                        borderBottom: darkMode
                          ? "1px solid #ddd"
                          : "1px solid #444",
                      }}
                    >
                      <button
                        onClick={() => {
                          const favIndex = hadiths.findIndex(
                            (h) => h.id === fav.id
                          );
                          const totalHadiths = hadiths.length;
                          const todayIndex =
                            getDayOfYear(new Date()) % totalHadiths;

                          let offset = favIndex - todayIndex;
                          if (offset > 0) {
                            // If favorite is in the future, wrap it to the past
                            offset = offset - totalHadiths;
                          }

                          setDayOffset(offset);
                          setCurrentView("hadith");
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
                        aria-label={`View hadith: ${hadithOnly.slice(
                          0,
                          30
                        )}...`}
                      >
                        <span
                          style={{ direction: "rtl", unicodeBidi: "plaintext" }}
                        >
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
          )}
        </div>
      </Content>
    </Layout>
  );
}
