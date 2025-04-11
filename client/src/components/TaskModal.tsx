/**
 * # TaskModal.tsx
 * Модальное окно для создания / редактирования задачи. Поддерживает черновик.
 *
 * @packageDocumentation
 */

import React, { useEffect, useState, useMemo } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  CircularProgress,
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
import TaskForm from "./TaskForm";
import { useForm, FormProvider } from "react-hook-form";
import type { TaskFormData, TaskModalProps } from "../types/interfaces";

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

  // Локальные состояния
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

  const { data: fetchedTask, isLoading: isTaskLoading } = useGetTaskByIdQuery(
    taskId!,
    { skip: !taskId }
  );
  const { data: boards, isLoading: boardsLoading } = useGetBoardsQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  // Загрузка данных при редактировании
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
      setBoardValue(defaultBoardId.toString());
    }
  }, [isEditMode, fetchedTask, defaultBoardId, forcedBoardId, boards]);

  // Сохранение в черновик при создании
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
  }, [
    isEditMode,
    title,
    description,
    priority,
    boardValue,
    assigneeValue,
    draft,
    setDraft,
  ]);

  // Проверяем, что boardValue / assigneeValue доступны
  useEffect(() => {
    if (!isEditMode) {
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

  // ----- React Hook Form -----
  const methods = useForm<TaskFormData>({
    mode: "onSubmit",
    defaultValues: {
      title,
      description,
      priority,
      status,
      boardValue,
      assigneeValue,
    },
  });
  const {
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset({
      title,
      description,
      priority,
      status,
      boardValue,
      assigneeValue,
    });
  }, [title, description, priority, status, boardValue, assigneeValue, reset]);

  const onSubmit = async () => {
    const boardIdNum = boardValue ? parseInt(boardValue) : 0;
    const assigneeIdNum = assigneeValue ? parseInt(assigneeValue) : 0;
    try {
      if (isEditMode && taskId) {
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
        clearDraft();
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

  // Если идёт загрузка информации о задаче (в режиме редактирования)
  if (isEditMode && isTaskLoading) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={{ ...style, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <Box sx={style}>
            <Typography variant="h6" gutterBottom>
              {modalTitle}
            </Typography>

            <TaskForm
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              priority={priority}
              setPriority={setPriority}
              status={status}
              setStatus={setStatus}
              boardValue={boardValue}
              setBoardValue={setBoardValue}
              assigneeValue={assigneeValue}
              setAssigneeValue={setAssigneeValue}
              isEditMode={isEditMode}
              isBoardLocked={isBoardLocked}
              boards={boards}
              boardsLoading={boardsLoading}
              users={users}
              usersLoading={usersLoading}
              register={methods.register}
              errors={errors}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                type="submit"
                disabled={isCreating || isUpdating}
              >
                {isEditMode ? "Обновить" : "Создать"}
              </Button>
              <Button variant="outlined" onClick={onClose}>
                Отмена
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              {showGoToBoardButton && boardValue && (
                <Button variant="outlined" onClick={handleGoToBoard}>
                  Перейти на доску
                </Button>
              )}
            </Box>
          </Box>
        </FormProvider>
      </form>
    </Modal>
  );
};

export default TaskModal;
