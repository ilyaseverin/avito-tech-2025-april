// src/pages/Issues/IssuesPage.tsx

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetAllTasksQuery, useGetBoardsQuery } from "../api/baseApi";
import type { GetTasksResponse, GetBoardsResponse } from "../types/models";
import TaskModal from "../components/TaskModal";
import { useDebounce } from "../hooks/useDebounce"; // ваш хук debounce

const IssuesPage: React.FC = () => {
  const { data: tasks, isLoading, isError } = useGetAllTasksQuery();
  const { data: boards } = useGetBoardsQuery();
  const [selectedTask, setSelectedTask] = useState<GetTasksResponse | null>(
    null
  );

  // Состояния фильтров
  const [rawSearchText, setRawSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Все");
  // Фильтр по названию доски (а не по boardId)
  const [filterBoard, setFilterBoard] = useState<string>("Все");

  // Дебаунсированное значение для поля поиска
  const searchText = useDebounce(rawSearchText, 300);

  const navigate = useNavigate();

  if (isLoading) return <div>Загрузка задач...</div>;
  if (isError) return <div>Ошибка при загрузке задач</div>;
  if (!tasks) return null;

  // Фильтрация задач:
  // - По статусу (Backlog, InProgress, Done, «Все»)
  // - По названию доски (task.boardName против filterBoard)
  // - Поиск: начинается только при длине searchText >= 3, иначе пропускаем
  //   поиск, т.е. matchesSearch = true
  const filteredTasks = tasks.filter((task) => {
    // Фильтр по статусу
    const matchesStatus =
      filterStatus === "Все" || task.status === filterStatus;

    // Фильтр по названию доски
    const matchesBoard =
      filterBoard === "Все" || task.boardName === filterBoard;

    // Поиск по названию задачи и исполнителю
    // Если строка поиска короче 3 символов – игнорируем поиск, matchesSearch = true
    const lowerSearch = searchText.toLowerCase();
    const matchesSearch =
      searchText.length < 3
        ? true
        : task.title.toLowerCase().includes(lowerSearch) ||
          task.assignee.fullName.toLowerCase().includes(lowerSearch);

    return matchesStatus && matchesBoard && matchesSearch;
  });

  // При клике на карточку задачи -> открываем TaskModal
  const handleCardClick = (task: GetTasksResponse) => {
    setSelectedTask(task);
  };

  // Переход на страницу доски
  const handleGoToBoard = (boardId: number) => {
    navigate(`/board/${boardId}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Все задачи
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Поиск по задаче/исполнителю"
          variant="outlined"
          value={rawSearchText}
          onChange={(e) => setRawSearchText(e.target.value)}
          sx={{ flex: "1 1 300px" }}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Фильтр по статусу */}
          <FormControl variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">Статус</InputLabel>
            <Select
              labelId="status-filter-label"
              label="Статус"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="Все">Все</MenuItem>
              <MenuItem value="Backlog">Backlog</MenuItem>
              <MenuItem value="InProgress">InProgress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel id="board-filter-label">Доска</InputLabel>
            <Select
              labelId="board-filter-label"
              label="Доска"
              value={filterBoard}
              onChange={(e) => setFilterBoard(e.target.value)}
            >
              <MenuItem value="Все">Все</MenuItem>
              {boards?.map((b: GetBoardsResponse) => (
                <MenuItem key={b.id} value={b.name}>
                  {b.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Список задач */}
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
      {selectedTask && (
        <TaskModal
          open={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          taskId={selectedTask.id}
          forcedBoardId={selectedTask.boardId}
          showGoToBoardButton={true}
          onGoToBoard={handleGoToBoard}
        />
      )}
    </Box>
  );
};

export default IssuesPage;
