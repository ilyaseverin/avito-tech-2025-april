/**
 * # formTypes.ts
 * Интерфейсы.
 *
 * @packageDocumentation
 */

import { FieldErrors, UseFormRegister } from "react-hook-form";
import type {
  GetTasksOnBoardResponse,
  GetTasksResponse,
  Priority,
  Status,
} from "./models";

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  status: Status; // при редактировании
  boardValue: string;
  assigneeValue: string;
}

export interface ColumnsProps {
  backlog: GetTasksOnBoardResponse[];
  inProgress: GetTasksOnBoardResponse[];
  done: GetTasksOnBoardResponse[];
  onCardClick: (task: GetTasksOnBoardResponse) => void;
  onStatusChange: (taskId: number, newStatus: Status) => void;
}

export interface DraggableCardProps {
  task: GetTasksOnBoardResponse;
  onCardClick: (task: GetTasksOnBoardResponse) => void;
}

export interface IssueCardProps {
  task: GetTasksResponse;
  onClick: (task: GetTasksResponse) => void;
}

export interface Board {
  id: number;
  name: string;
}

export interface User {
  id: number;
  fullName: string;
}

export interface TaskFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  priority: Priority;
  setPriority: React.Dispatch<React.SetStateAction<Priority>>;
  status?: Status;
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

  register: UseFormRegister<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
}

export interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  taskId?: number;
  defaultBoardId?: number;
  isBoardLocked?: boolean;
  showGoToBoardButton?: boolean;
  onGoToBoard?: (boardId: number) => void;
  forcedBoardId?: number;
}
