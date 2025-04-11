// src/pages/Board/BoardPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import {
  useGetBoardTasksQuery,
  useGetBoardsQuery,
  useUpdateTaskStatusMutation,
} from "../api/baseApi";
import type { GetTasksOnBoardResponse } from "../types/models";
import TaskModal from "../components/TaskModal";
import Columns from "../components/Columns";

const BoardPage: React.FC = () => {
  const { id } = useParams();
  const boardId = Number(id);

  // Загружаем задачи доски и список всех досок
  const { data: tasks, isLoading, isError } = useGetBoardTasksQuery(boardId);
  const { data: allBoards } = useGetBoardsQuery();

  const [editTask, setEditTask] = useState<GetTasksOnBoardResponse | null>(
    null
  );
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  if (isLoading) return <div>Загрузка задач доски...</div>;
  if (isError) return <div>Ошибка при загрузке задач доски</div>;
  if (!tasks) return null;

  const thisBoard = allBoards?.find((b) => b.id === boardId);

  // Фильтрация задач по статусам
  const backlog = tasks.filter((t) => t.status === "Backlog");
  const inProgress = tasks.filter((t) => t.status === "InProgress");
  const done = tasks.filter((t) => t.status === "Done");

  const handleCardClick = (task: GetTasksOnBoardResponse) => {
    setEditTask(task);
  };

  const handleStatusChange = (
    taskId: number,
    newStatus: "Backlog" | "InProgress" | "Done"
  ) => {
    updateTaskStatus({ taskId, data: { status: newStatus } });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {thisBoard
          ? `Проект: ${thisBoard.name}`
          : `Доска #${boardId} (название не найдено)`}
      </Typography>

      <Columns
        backlog={backlog}
        inProgress={inProgress}
        done={done}
        onCardClick={handleCardClick}
        onStatusChange={handleStatusChange}
      />

      {editTask && (
        <TaskModal
          open={Boolean(editTask)}
          onClose={() => setEditTask(null)}
          taskId={editTask.id}
          defaultBoardId={boardId}
          isBoardLocked={true}
          showGoToBoardButton={false}
        />
      )}
    </Box>
  );
};

export default BoardPage;
