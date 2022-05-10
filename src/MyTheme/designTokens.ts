import { ThemeEnum } from "./MyTheme";

export const getDesignTokens = (mode: ThemeEnum) => {
  if (mode === ThemeEnum.light) {
    return {
      palette: {
        mode,
        primary: {
          main: "#50698a",
        },
        secondary: {
          main: "#3e5183",
        },
        background: {
          default: "rgba(228,232,229,0.932)",
          paper: "#fafafa",
        },
      },
    };
  } else if (mode === ThemeEnum.dark) {
    return {
      palette: {
        mode,
        primary: {
          main: "#9fa3b5",
        },
        secondary: {
          main: "#3e5183",
        },
        background: {
          default: "#1c223d",
          paper: "#212446",
        },
        text: {
          primary: "#e2e2f3",
        },
      },
    };
  }
};
