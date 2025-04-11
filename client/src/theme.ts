/**
 * # theme.ts
 * Создание MUI темы для цветовых настроек.
 *
 * @packageDocumentation
 */

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ffffff",
    },
    info: {
      main: "#d14b02", // Оранжеватый цвет для кнопки "Создать задачу"
    },
  },
});

export default theme;
