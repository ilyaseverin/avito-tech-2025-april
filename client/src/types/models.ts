// src/types/models.ts

export type Priority = "Low" | "Medium" | "High";
export type Status = "Backlog" | "InProgress" | "Done";

// ---------- BOARDS ----------
/** Ответ при GET /boards */
export interface GetBoardsResponse {
  id: number;
  name: string;
  description: string;
  taskCount: number;
}

/** Ответ при GET /boards/{boardId} */
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

// ---------- TASKS ----------
/** Ответ при GET /tasks */
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

/**
 * Ответ при GET /tasks/{taskId}
 * Обратите внимание, что здесь нет boardId, только boardName и assignee
 */
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

/** Создание задачи (POST /tasks/create) */
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

/** Обновление задачи (PUT /tasks/update/{taskId}) */
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

/** Обновление статуса (PUT /tasks/updateStatus/{taskId}) */
export interface UpdateTaskStatusRequest {
  status: Status;
}
export interface UpdateTaskStatusResponse {
  message: string;
}

// ---------- USERS ----------
/** Ответ при GET /users */
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
