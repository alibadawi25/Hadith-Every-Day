import React, { useState } from "react";
import { Layout } from "antd";
import "antd/dist/reset.css";
import "./App.css";

// Components
import AppHeader from "./components/AppHeader";
import HadithView from "./components/HadithView";
import FavoritesView from "./components/FavoritesView";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";

// Hooks
import {
  useHadithData,
  useFavorites,
  useOnlineStatus,
  useWindowWidth,
} from "./hooks/useHadithApp";

// Utils
import { calculateHadithIndex, formatDates } from "./utils/dateUtils";

const { Content } = Layout;

export default function App() {
  const [currentView, setCurrentView] = useState("hadith");
  const [dayOffset, setDayOffset] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Custom hooks
  const { hadiths, loading, error } = useHadithData();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const isOnline = useOnlineStatus();
  const windowWidth = useWindowWidth();

  // Early returns for loading and error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // Calculate current hadith
  const { index, offsetDate } = calculateHadithIndex(hadiths, dayOffset);
  const hadith = hadiths[index];
  const { gregorianString, hijriDate } = formatDates(offsetDate);

  if (!hadith) return null;

  // Navigation functions
  const prevHadith = () => setDayOffset((prev) => prev - 1);
  const nextHadith = () => {
    if (dayOffset < 0) setDayOffset((prev) => prev + 1);
  };

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <AppHeader
        darkMode={darkMode}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOnline={isOnline}
      />

      <Content
        style={{
          backgroundColor: darkMode ? "#222" : "#fefefe",
          color: darkMode ? "#eee" : "#111",
        }}
      >
        <div>
          {currentView === "hadith" && (
            <HadithView
              hadith={hadith}
              gregorianString={gregorianString}
              hijriDate={hijriDate}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              windowWidth={windowWidth}
              prevHadith={prevHadith}
              nextHadith={nextHadith}
              toggleFavorite={() => toggleFavorite(hadith)}
              isFavorite={isFavorite(hadith)}
              dayOffset={dayOffset}
            />
          )}
          {currentView === "favorites" && (
            <FavoritesView
              favorites={favorites}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              hadiths={hadiths}
              index={index}
              currentView={currentView}
              setDayOffset={setDayOffset}
              setCurrentView={setCurrentView}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
}
