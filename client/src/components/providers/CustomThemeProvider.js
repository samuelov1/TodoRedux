import React, { useState } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

export const CustomThemeContext = React.createContext({
  currentTheme: "normal",
  toggleDarkMode: null
});

const CustomThemeProvider = ({ children }) => {
  const initialDarkMode = localStorage.getItem("darkMode") === "true";
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const theme = createMuiTheme({
    palette: { type: darkMode ? "dark" : "light" }
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  return (
    <CustomThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

export default CustomThemeProvider;
