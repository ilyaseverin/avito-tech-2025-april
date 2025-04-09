// src/pages/Boards/BoardsPage.tsx

import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useGetBoardsQuery } from "../api/baseApi";

const BoardsPage: React.FC = () => {
  const { data: boards, isLoading, isError } = useGetBoardsQuery();

  if (isLoading) return <div>Загрузка списка досок...</div>;
  if (isError) return <div>Ошибка при загрузке досок</div>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Все доски
      </Typography>

      {boards?.map((board) => (
        <Card key={board.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{board.name}</Typography>
            <Typography variant="body2">{board.description}</Typography>
            <Typography variant="body2">
              Количество задач: {board.taskCount}
            </Typography>
            <Button
              component={Link}
              to={`/board/${board.id}`}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              Перейти к доске
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default BoardsPage;
