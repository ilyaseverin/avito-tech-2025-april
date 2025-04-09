import React, { useState } from "react";
import { Box, Card, CardContent, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetAllTasksQuery } from "../api/baseApi";
import type { GetTasksResponse } from "../types/models";
import TaskModal from "../components/TaskModal";

const IssuesPage: React.FC = () => {
  const { data: tasks, isLoading, isError } = useGetAllTasksQuery();
  const [selectedTask, setSelectedTask] = useState<GetTasksResponse | null>(
    null
  );
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  if (isLoading) return <div>Загрузка задач...</div>;
  if (isError) return <div>Ошибка при загрузке задач</div>;
  if (!tasks) return null;

  // Поиск
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  // При клике сохраняем ВЕСЬ объект, чтобы иметь и .id, и .boardId
  const handleCardClick = (task: GetTasksResponse) => {
    setSelectedTask(task);
  };

  // Переход к доске
  const handleGoToBoard = (boardId: number) => {
    navigate(`/board/${boardId}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Все задачи
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Поиск по названию задачи"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {filteredTasks.map((task) => (
        <Card
          key={task.id}
          sx={{ mb: 2, cursor: "pointer" }}
          onClick={() => handleCardClick(task)}
        >
          <CardContent>
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body2">
              {task.description.substring(0, 80)}...
            </Typography>
            <Typography variant="body2">Статус: {task.status}</Typography>
            <Typography variant="body2">Доска: {task.boardName}</Typography>
          </CardContent>
        </Card>
      ))}

      {/* При выбранной задаче открываем общий TaskModal */}
      {selectedTask && (
        <TaskModal
          open={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          // Редактируем задачу с этим ID
          taskId={selectedTask.id}
          // И САМОЕ ВАЖНОЕ — передаём boardId,
          //  т.к. /tasks/{taskId} вернёт только boardName
          forcedBoardId={selectedTask.boardId}
          showGoToBoardButton={true}
          onGoToBoard={handleGoToBoard}
        />
      )}
    </Box>
  );
};

export default IssuesPage;
