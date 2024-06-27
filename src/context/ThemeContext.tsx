import React, { createContext, useEffect, useState } from "react";

import { THEME } from "../theme/index";

const initialState = {
  theme: THEME.LIGHT,
  setTheme: (theme: THEME) => {}, // eslint-disable-line
  toogleTheme: () => {},
};

const ThemeContext = createContext(initialState);

type ThemeProviderProps = {
  children: React.ReactNode;
};

function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, _setTheme] = useState<THEME>(initialState.theme);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      _setTheme(JSON.parse(storedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  const setTheme = (_theme: THEME) => {
    _setTheme(_theme);
  };

  const toogleTheme = () => {
    _setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toogleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext };
