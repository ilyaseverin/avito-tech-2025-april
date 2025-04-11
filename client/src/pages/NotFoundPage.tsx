/**
 * @file NotFoundPage.tsx
 * @description Страница 404 "Не найдено".
 */

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 8,
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Страница не найдена
      </Typography>
      <Typography variant="body1" gutterBottom>
        Извините, но запрошенная вами страница не существует.
      </Typography>
      <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
        Вернуться на главную
      </Button>
    </Box>
  );
};

export default NotFoundPage;
