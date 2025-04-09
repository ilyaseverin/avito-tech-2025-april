import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // синий по умолчанию
    },
    secondary: {
      main: "#9c27b0",
    },
  },
  // Прочие настройки темы
});

export default theme;
