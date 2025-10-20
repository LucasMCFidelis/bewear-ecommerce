"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface ThemeContextProps {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
}

export const ThemeContext = createContext({} as ThemeContextProps);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("isDarkMode", String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
