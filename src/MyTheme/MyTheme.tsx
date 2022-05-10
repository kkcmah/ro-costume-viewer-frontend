import { createContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getDesignTokens } from "./designTokens";

export enum ThemeEnum {
  light = "light",
  dark = "dark",
}

export const ColorModeContext = createContext({
  toggleColorMode: () => {
    return;
  },
});

interface MyThemeProps {
  children: React.ReactElement;
}

const MyTheme = ({ children }: MyThemeProps) => {
  const [mode, setMode] = useState<ThemeEnum>(ThemeEnum.dark);
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) =>
          prevMode === ThemeEnum.light ? ThemeEnum.dark : ThemeEnum.light
        );
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default MyTheme;
