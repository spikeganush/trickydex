import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTricks, Trick } from '../types/trick';
import { preloadSounds, unloadSounds } from '../utils/sounds';

interface AppContextType {
  favorites: number[];
  addFavorite: (trickId: number) => void;
  removeFavorite: (trickId: number) => void;
  isFavorite: (trickId: number) => boolean;
  recentlyViewed: number[];
  addToRecentlyViewed: (trickId: number) => void;
  getFavorites: () => Trick[];
  getRecentlyViewed: () => Trick[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);

  // Preload sounds when the app starts
  useEffect(() => {
    preloadSounds();
    return () => {
      unloadSounds();
    };
  }, []);

  const addFavorite = (trickId: number) => {
    setFavorites((prev) => {
      if (!prev.includes(trickId)) {
        return [...prev, trickId];
      }
      return prev;
    });
  };

  const removeFavorite = (trickId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== trickId));
  };

  const isFavorite = (trickId: number) => {
    return favorites.includes(trickId);
  };

  const addToRecentlyViewed = (trickId: number) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((id) => id !== trickId);
      // Add to the beginning and limit to 10 items
      return [trickId, ...filtered].slice(0, 10);
    });
  };

  const getFavorites = () => {
    return initialTricks.filter((trick) => favorites.includes(trick.id));
  };

  const getRecentlyViewed = () => {
    return recentlyViewed
      .map((id) => initialTricks.find((trick) => trick.id === id))
      .filter((trick): trick is Trick => trick !== undefined);
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        recentlyViewed,
        addToRecentlyViewed,
        getFavorites,
        getRecentlyViewed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
