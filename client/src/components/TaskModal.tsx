// src/components/TaskModal.tsx

import React, { useEffect, useState, useMemo } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetTaskByIdQuery,
  useGetBoardsQuery,
  useGetUsersQuery,
} from "../api/baseApi";
import type {
  Priority,
  Status,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../types/models";
import { useTaskDraft, TaskDraft } from "../hooks/useTaskDraft";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  taskId?: number;
  defaultBoardId?: number;
  isBoardLocked?: boolean;
  showGoToBoardButton?: boolean;
  onGoToBoard?: (boardId: number) => void;
  forcedBoardId?: number;
}

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  taskId,
  defaultBoardId,
  isBoardLocked = false,
  forcedBoardId,
  showGoToBoardButton = false,
  onGoToBoard,
}) => {
  const isEditMode = Boolean(taskId);

  // Мемоизируем изначальный draft, чтобы не пересоздавать объект:
  const initialDraft = useMemo<TaskDraft>(
    () => ({
      title: "",
      description: "",
      priority: "Medium",
      boardValue: defaultBoardId ? defaultBoardId.toString() : "",
      assigneeValue: "",
    }),
    [defaultBoardId]
  );

  const { draft, setDraft, clearDraft } = useTaskDraft(
    "newTaskDraft",
    initialDraft
  );

  // Состояния для полей:
  const [title, setTitle] = useState(isEditMode ? "" : draft.title);
  const [description, setDescription] = useState(
    isEditMode ? "" : draft.description
  );
  const [priority, setPriority] = useState<Priority>(
    isEditMode ? "Medium" : draft.priority
  );
  const [status, setStatus] = useState<Status>("Backlog");
  const [boardValue, setBoardValue] = useState<string>(
    isEditMode
      ? defaultBoardId
        ? defaultBoardId.toString()
        : ""
      : draft.boardValue
  );
  const [assigneeValue, setAssigneeValue] = useState<string>(
    isEditMode ? "" : draft.assigneeValue
  );

  // Данные с сервера
  const { data: fetchedTask } = useGetTaskByIdQuery(taskId!, { skip: !taskId });
  const { data: boards, isLoading: boardsLoading } = useGetBoardsQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  // Заполняем поля из API при редактировании
  useEffect(() => {
    if (isEditMode && fetchedTask) {
      setTitle(fetchedTask.title);
      setDescription(fetchedTask.description);
      setPriority(fetchedTask.priority);
      setStatus(fetchedTask.status);
      setAssigneeValue(fetchedTask.assignee.id.toString());

      if (defaultBoardId) {
        setBoardValue(defaultBoardId.toString());
      } else if (forcedBoardId) {
        setBoardValue(forcedBoardId.toString());
      } else if (boards && boards.length > 0) {
        const found = boards.find((b) => b.name === fetchedTask.boardName);
        setBoardValue(found ? found.id.toString() : "");
      } else {
        setBoardValue("");
      }
    } else if (!isEditMode && defaultBoardId) {
      // Создание: если есть defaultBoardId, выставляем его
      setBoardValue(defaultBoardId.toString());
    }
  }, [isEditMode, fetchedTask, defaultBoardId, forcedBoardId, boards]);

  // Сохраняем в черновик при создании задачи
  useEffect(() => {
    if (!isEditMode) {
      const newDraft: TaskDraft = {
        title,
        description,
        priority,
        boardValue,
        assigneeValue,
      };
      if (JSON.stringify(draft) !== JSON.stringify(newDraft)) {
        setDraft(newDraft);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isEditMode,
    title,
    description,
    priority,
    boardValue,
    assigneeValue,
    setDraft,
  ]);

  // Если boardValue не найден в boards — сбрасываем его. Аналогично для assigneeValue и users
  useEffect(() => {
    if (!isEditMode) {
      // Только если создаем
      if (boards && boards.length > 0 && boardValue) {
        const availableBoardIds = boards.map((b) => b.id.toString());
        if (!availableBoardIds.includes(boardValue)) {
          setBoardValue("");
        }
      }
      if (users && users.length > 0 && assigneeValue) {
        const availableUserIds = users.map((u) => u.id.toString());
        if (!availableUserIds.includes(assigneeValue)) {
          setAssigneeValue("");
        }
      }
    }
  }, [isEditMode, boards, boardValue, users, assigneeValue]);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      console.warn("Заполните поля 'Название задачи' и 'Описание'");
      return;
    }
    const boardIdNum = boardValue ? parseInt(boardValue) : 0;
    const assigneeIdNum = assigneeValue ? parseInt(assigneeValue) : 0;
    try {
      if (isEditMode && taskId) {
        // Редактирование
        const payload: UpdateTaskRequest = {
          title,
          description,
          priority,
          status,
          assigneeId: assigneeIdNum,
        };
        await updateTask({ taskId, data: payload }).unwrap();
      } else {
        // Создание
        if (!boardIdNum) {
          console.warn("Не выбран проект (boardId)!");
          return;
        }
        const payload: CreateTaskRequest = {
          title,
          description,
          priority,
          boardId: boardIdNum,
          assigneeId: assigneeIdNum,
        };
        await createTask(payload).unwrap();
        clearDraft(); // очистка черновика
      }
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении задачи:", error);
    }
  };

  const handleGoToBoard = () => {
    if (onGoToBoard && boardValue) {
      onGoToBoard(parseInt(boardValue));
    }
  };

  if (!open) return null;

  const modalTitle = isEditMode ? "Редактирование задачи" : "Создание задачи";

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          {modalTitle}
        </Typography>

        <TextField
          label="Название задачи"
          fullWidth
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Описание задачи"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Проект (Доска) */}
        <FormControl fullWidth margin="normal" disabled={boardsLoading}>
          <InputLabel id="board-label">Проект (Доска)</InputLabel>
          <Select
            labelId="board-label"
            label="Проект (Доска)"
            value={boardsLoading ? "" : boardValue}
            onChange={(e) => setBoardValue(e.target.value as string)}
            disabled={isBoardLocked || boardsLoading}
          >
            {boards?.length ? (
              boards.map((b) => (
                <MenuItem key={b.id} value={b.id.toString()}>
                  {b.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">Нет доступных проектов</MenuItem>
            )}
          </Select>
        </FormControl>

        {/* Приоритет */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="priority-label">Приоритет</InputLabel>
          <Select
            labelId="priority-label"
            label="Приоритет"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>

        {/* Статус — только при редактировании */}
        {isEditMode && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Статус</InputLabel>
            <Select
              labelId="status-label"
              label="Статус"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <MenuItem value="Backlog">Backlog</MenuItem>
              <MenuItem value="InProgress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Исполнитель */}
        <FormControl fullWidth margin="normal" disabled={usersLoading}>
          <InputLabel id="assignee-label">Исполнитель</InputLabel>
          <Select
            labelId="assignee-label"
            label="Исполнитель"
            value={usersLoading ? "" : assigneeValue}
            onChange={(e) => setAssigneeValue(e.target.value as string)}
          >
            {users?.length ? (
              users.map((u) => (
                <MenuItem key={u.id} value={u.id.toString()}>
                  {u.fullName}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">Нет данных</MenuItem>
            )}
          </Select>
        </FormControl>

        {showGoToBoardButton && boardValue && (
          <Button variant="outlined" onClick={handleGoToBoard} sx={{ mt: 1 }}>
            Перейти на доску
          </Button>
        )}

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
          >
            {isEditMode ? "Обновить" : "Создать"}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Отмена
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskModal;
