import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper, Card, CardContent } from "@mui/material";

import { useGetBoardTasksQuery, useGetBoardsQuery } from "../api/baseApi";
import type { GetTasksOnBoardResponse } from "../types/models";
import TaskModal from "../components/TaskModal";

const BoardPage: React.FC = () => {
  console.log("reload");
  const { id } = useParams();
  const boardId = Number(id);

  // 1) Загружаем задачи доски
  const { data: tasks, isLoading, isError } = useGetBoardTasksQuery(boardId);

  // 2) Загружаем список всех досок, чтобы найти название нужной
  const { data: allBoards } = useGetBoardsQuery();

  // Состояние редактируемой задачи (по клику на карточку)
  const [editTask, setEditTask] = useState<GetTasksOnBoardResponse | null>(
    null
  );

  if (isLoading) return <div>Загрузка задач доски...</div>;
  if (isError) return <div>Ошибка при загрузке задач доски</div>;
  if (!tasks) return null;

  // Находим доску среди всех
  const thisBoard = allBoards?.find((b) => b.id === boardId);

  // Группируем задачи
  const backlog = tasks.filter((t) => t.status === "Backlog");
  const inProgress = tasks.filter((t) => t.status === "InProgress");
  const done = tasks.filter((t) => t.status === "Done");

  const handleCardClick = (task: GetTasksOnBoardResponse) => {
    // При клике на задачу -> редактирование
    setEditTask(task);
  };

  return (
    <Box>
      {/* Показываем название доски, если нашли */}
      <Typography variant="h4" gutterBottom>
        {thisBoard
          ? `Проект: ${thisBoard.name}`
          : `Доска #${boardId} (название не найдено)`}
      </Typography>

      {/* Колонки */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Backlog
          </Typography>
          {backlog.map((task) => (
            <Card
              key={task.id}
              sx={{ mb: 2, cursor: "pointer" }}
              onClick={() => handleCardClick(task)}
            >
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2">{task.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Paper>

        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            In Progress
          </Typography>
          {inProgress.map((task) => (
            <Card
              key={task.id}
              sx={{ mb: 2, cursor: "pointer" }}
              onClick={() => handleCardClick(task)}
            >
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2">{task.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Paper>

        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Done
          </Typography>
          {done.map((task) => (
            <Card
              key={task.id}
              sx={{ mb: 2, cursor: "pointer" }}
              onClick={() => handleCardClick(task)}
            >
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2">{task.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Paper>
      </Box>

      {/* Модалка редактирования задачи */}
      {editTask && (
        <TaskModal
          open={Boolean(editTask)}
          onClose={() => setEditTask(null)}
          taskId={editTask.id}
          // При редактировании поле "Проект" нужно заблокировать
          defaultBoardId={boardId}
          isBoardLocked={true}
          showGoToBoardButton={false}
        />
      )}
    </Box>
  );
};

export default BoardPage;
