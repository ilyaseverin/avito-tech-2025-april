/**
 * # IssuesPage.tsx
 * Страница со списком всех задач. Поддерживает поиск (дебаунс >= 3 символов), фильтр по статусу, фильтр по названию доски.
 *
 * @packageDocumentation
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetAllTasksQuery, useGetBoardsQuery } from "../api/baseApi";
import type { GetTasksResponse, GetBoardsResponse } from "../types/models";
import TaskModal from "../components/TaskModal";
import { useDebounce } from "../hooks/useDebounce";
import IssueCard from "../components/IssueCard";

export const IssuesPage: React.FC = () => {
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
  } = useGetAllTasksQuery();
  const {
    data: boards,
    isLoading: isLoadingBoards,
    isError: isErrorBoards,
  } = useGetBoardsQuery();

  const [selectedTask, setSelectedTask] = useState<GetTasksResponse | null>(
    null
  );

  // Фильтры
  const [rawSearchText, setRawSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Все");
  const [filterBoard, setFilterBoard] = useState<string>("Все");

  // Дебаунс
  const searchText = useDebounce(rawSearchText, 300);
  const navigate = useNavigate();

  if (isLoadingTasks || isLoadingBoards) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isErrorTasks || isErrorBoards || !tasks) {
    return <div>Ошибка при загрузке задач или досок</div>;
  }

  // Фильтрация
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === "Все" || task.status === filterStatus;
    const matchesBoard =
      filterBoard === "Все" || task.boardName === filterBoard;

    const lowerSearch = searchText.toLowerCase();
    const matchesSearch =
      searchText.length < 3 ||
      task.title.toLowerCase().includes(lowerSearch) ||
      task.assignee.fullName.toLowerCase().includes(lowerSearch);

    return matchesStatus && matchesBoard && matchesSearch;
  });

  const handleCardClick = (task: GetTasksResponse) => {
    setSelectedTask(task);
  };

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

      {filteredTasks.map((task) => (
        <IssueCard key={task.id} task={task} onClick={handleCardClick} />
      ))}

      {selectedTask && (
        <TaskModal
          open={true}
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
