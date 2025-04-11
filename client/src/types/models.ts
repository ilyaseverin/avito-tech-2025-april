/**
 * @file models.ts
 * @description Общие типы (интерфейсы) для данных, которые возвращает API.
 */

export type Priority = "Low" | "Medium" | "High";
export type Status = "Backlog" | "InProgress" | "Done";

/** Boards */
export interface GetBoardsResponse {
  id: number;
  name: string;
  description: string;
  taskCount: number;
}

/** GET /boards/{boardId} -> задачи доски */
export interface GetTasksOnBoardResponse {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
}

/** GET /tasks */
export interface GetTasksResponse {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  boardId: number;
  boardName: string;
  assigneeId: number;
  assignee: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
}

/** GET /tasks/{taskId} */
export interface GetTaskByIDResponse {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  boardName: string;
  assignee: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
}

/** Создание задачи */
export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: Priority;
  boardId: number;
  assigneeId: number;
}
export interface CreateTaskResponse {
  id: number;
}

/** Обновление задачи */
export interface UpdateTaskRequest {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assigneeId: number;
}
export interface UpdateTaskResponse {
  message: string;
}

/** Обновление статуса задачи */
export interface UpdateTaskStatusRequest {
  status: Status;
}
export interface UpdateTaskStatusResponse {
  message: string;
}

/** Users */
export interface GetUsersResponse {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  description?: string;
  tasksCount?: number;
  teamId?: number;
  teamName?: string;
}
