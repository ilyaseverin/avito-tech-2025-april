/**
 * @file theme.ts
 * @description Создание MUI темы для цветовых настроек.
 */

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Синий по умолчанию
    },
    secondary: {
      main: "#ffffff", // Белый
    },
    info: {
      main: "#d14b02", // Цвет для кнопки "Создать задачу"
    },
  },
});

export default theme;
