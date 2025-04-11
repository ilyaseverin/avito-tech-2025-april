/**
 * # BoardsPage.tsx
 * Страница со списком всех досок. При нажатии — переход на конкретную доску.
 *
 * @packageDocumentation
 */

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useGetBoardsQuery } from "../api/baseApi";

export const BoardsPage: React.FC = () => {
  const { data: boards, isLoading, isError } = useGetBoardsQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError || !boards) {
    return <div>Ошибка при загрузке досок</div>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Все доски
      </Typography>

      {boards.map((board) => (
        <Card key={board.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box>
                <Typography variant="h6">{board.name}</Typography>
                <Typography variant="body2">{board.description}</Typography>
                <Typography variant="body2">
                  Количество задач: {board.taskCount}
                </Typography>
              </Box>
              <Button
                component={Link}
                to={`/board/${board.id}`}
                variant="outlined"
                sx={{ ml: "auto" }}
              >
                Перейти к доске
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
