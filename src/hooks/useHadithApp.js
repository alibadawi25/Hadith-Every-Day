import { useState, useEffect } from "react";

const LOCAL_STORAGE_FAVORITES_KEY = "hadith_favorites";

export function useHadithData() {
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHadiths = async () => {
      try {
        // Try to load from network first
        const res = await fetch("/riyad_assalihin.json");
        if (!res.ok) throw new Error("Failed to load hadith data");
        const data = await res.json();

        if (!data.hadiths || data.hadiths.length === 0) {
          throw new Error("No hadiths found in data");
        }

        setHadiths(data.hadiths);
        // Cache the data for offline use
        localStorage.setItem("cached_hadiths", JSON.stringify(data.hadiths));
        setLoading(false);
      } catch (err) {
        // Try to load from cache if network fails
        const cachedHadiths = localStorage.getItem("cached_hadiths");
        if (cachedHadiths) {
          setHadiths(JSON.parse(cachedHadiths));
          setLoading(false);
          setError("Using offline data");
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    loadHadiths();
  }, []);

  return { hadiths, loading, error };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const favs = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
    return favs ? JSON.parse(favs) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  const toggleFavorite = (hadith) => {
    const isFavorite = favorites.some((fav) => fav.id === hadith.id);
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== hadith.id));
    } else {
      setFavorites([...favorites, hadith]);
    }
  };

  const isFavorite = (hadith) => favorites.some((fav) => fav.id === hadith.id);

  return { favorites, toggleFavorite, isFavorite };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
}
