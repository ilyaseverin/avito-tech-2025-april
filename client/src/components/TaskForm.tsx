import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { Priority, Status } from "../types/models";
import type { TaskFormData } from "../types/formTypes";

interface Board {
  id: number;
  name: string;
}

interface User {
  id: number;
  fullName: string;
}

interface TaskFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  priority: Priority;
  setPriority: React.Dispatch<React.SetStateAction<Priority>>;
  status?: Status; // может быть undefined, если форма на создание
  setStatus?: React.Dispatch<React.SetStateAction<Status>>;
  boardValue: string;
  setBoardValue: React.Dispatch<React.SetStateAction<string>>;
  assigneeValue: string;
  setAssigneeValue: React.Dispatch<React.SetStateAction<string>>;

  isEditMode: boolean;
  isBoardLocked: boolean;

  boards?: Board[];
  boardsLoading: boolean;
  users?: User[];
  usersLoading: boolean;

  // Пропсы от RHF
  register: UseFormRegister<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  status,
  setStatus,
  boardValue,
  setBoardValue,
  assigneeValue,
  setAssigneeValue,
  isEditMode,
  isBoardLocked,
  boards,
  boardsLoading,
  users,
  usersLoading,
  register,
  errors,
}) => {
  return (
    <>
      {/* Название задачи */}
      <TextField
        label="Название задачи"
        fullWidth
        variant="outlined"
        margin="normal"
        {...register("title", {
          required: "Название задачи обязательно",
          onChange: (e) => setTitle(e.target.value),
        })}
        value={title}
        error={!!errors.title} // если есть ошибка, поле подсвечивается
        helperText={errors.title?.message}
      />

      {/* Описание задачи */}
      <TextField
        label="Описание задачи"
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        margin="normal"
        {...register("description", {
          required: "Описание задачи обязательно",
          onChange: (e) => setDescription(e.target.value),
        })}
        value={description}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      {/* Проект (Доска) */}
      <FormControl
        fullWidth
        margin="normal"
        disabled={boardsLoading || isBoardLocked}
        error={!!errors.boardValue}
      >
        <InputLabel id="board-label">Проект (Доска)</InputLabel>
        <Select
          labelId="board-label"
          label="Проект (Доска)"
          {...register("boardValue", {
            required: "Проект (доска) обязателен",
            onChange: (e) => setBoardValue(e.target.value),
          })}
          value={boardsLoading ? "" : boardValue}
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
      {errors.boardValue && (
        <p style={{ color: "red", marginTop: 4 }}>
          {errors.boardValue.message}
        </p>
      )}

      {/* Приоритет */}
      <FormControl fullWidth margin="normal" error={!!errors.priority}>
        <InputLabel id="priority-label">Приоритет</InputLabel>
        <Select
          labelId="priority-label"
          label="Приоритет"
          {...register("priority", {
            required: "Приоритет обязателен",
            onChange: (e) => setPriority(e.target.value as Priority),
          })}
          value={priority}
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
      </FormControl>
      {errors.priority && (
        <p style={{ color: "red", marginTop: 4 }}>{errors.priority.message}</p>
      )}

      {/* Статус — только при редактировании */}
      {isEditMode && status && setStatus && (
        <FormControl fullWidth margin="normal" error={!!errors.status}>
          <InputLabel id="status-label">Статус</InputLabel>
          <Select
            labelId="status-label"
            label="Статус"
            {...register("status", {
              required: isEditMode ? "Статус обязателен" : false,
              onChange: (e) => setStatus(e.target.value as Status),
            })}
            value={status}
          >
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
      )}
      {isEditMode && errors.status && (
        <p style={{ color: "red", marginTop: 4 }}>{errors.status.message}</p>
      )}

      {/* Исполнитель */}
      <FormControl
        fullWidth
        margin="normal"
        disabled={usersLoading}
        error={!!errors.assigneeValue}
      >
        <InputLabel id="assignee-label">Исполнитель</InputLabel>
        <Select
          labelId="assignee-label"
          label="Исполнитель"
          {...register("assigneeValue", {
            required: "Исполнитель обязателен",
            onChange: (e) => setAssigneeValue(e.target.value),
          })}
          value={usersLoading ? "" : assigneeValue}
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
      {errors.assigneeValue && (
        <p style={{ color: "red", marginTop: 4 }}>
          {errors.assigneeValue.message}
        </p>
      )}
    </>
  );
};

export default TaskForm;
