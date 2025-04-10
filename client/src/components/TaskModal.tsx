// src/components/TaskModal.tsx

import React, { useEffect, useState } from "react";
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

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  /** Если передан taskId, значит редактируем задачу, иначе создаём */
  taskId?: number;
  /**
   * Если модалка вызывается со страницы доски,
   * передаём defaultBoardId для предзаполнения.
   */
  defaultBoardId?: number;
  /**
   * Флаг блокировки поля "Проект": при редактировании поле блокируется,
   * а при создании — нет.
   */
  isBoardLocked?: boolean;
  /**
   * Нужно ли отображать кнопку "Перейти на доску"?
   */
  showGoToBoardButton?: boolean;
  /**
   * Коллбэк при нажатии "Перейти на доску"
   */
  onGoToBoard?: (boardId: number) => void;
  /**
   * Если создаёте задачу из списка задач (IssuesPage), передаётся реальный boardId.
   */
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [status, setStatus] = useState<Status>("Backlog");
  // Используем строковое состояние для поля проекта, чтобы select корректно работал
  const [boardValue, setBoardValue] = useState<string>(
    defaultBoardId ? defaultBoardId.toString() : ""
  );
  const [assigneeValue, setAssigneeValue] = useState<string>("");

  // Загружаем данные задачи, если taskId задан (редактирование)
  const { data: fetchedTask } = useGetTaskByIdQuery(taskId!, {
    skip: !taskId,
  });
  const { data: boards, isLoading: boardsLoading } = useGetBoardsQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  useEffect(() => {
    if (taskId && fetchedTask) {
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
    } else if (!taskId && defaultBoardId) {
      // Режим создания: если defaultBoardId передан, устанавливаем его
      setBoardValue(defaultBoardId.toString());
    }
  }, [taskId, fetchedTask, defaultBoardId, forcedBoardId, boards]);

  const handleSubmit = async () => {
    if (!title || !description) return;

    const boardIdNum = boardValue ? parseInt(boardValue) : 0;
    const assigneeIdNum = assigneeValue ? parseInt(assigneeValue) : 0;
    try {
      if (taskId) {
        const payload: UpdateTaskRequest = {
          title,
          description,
          priority,
          status,
          assigneeId: assigneeIdNum,
        };
        await updateTask({ taskId, data: payload }).unwrap();
      } else {
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

  const isEditMode = Boolean(taskId);
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
            value={boardValue}
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
            value={assigneeValue}
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
          {usersLoading && (
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, textAlign: "center" }}
            >
              Загрузка...
            </Typography>
          )}
        </FormControl>

        {/* Кнопка "Перейти на доску" */}
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
