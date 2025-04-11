/**
 * @file baseApi.ts
 * @description RTK Query конфигурация: запросы к серверу (http://localhost:8080/api/v1).
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  GetBoardsResponse,
  GetTasksOnBoardResponse,
  GetTasksResponse,
  GetTaskByIDResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  UpdateTaskStatusRequest,
  UpdateTaskStatusResponse,
  GetUsersResponse,
} from "../types/models";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1",
  }),
  tagTypes: ["Boards", "Tasks", "Users"],
  endpoints: (builder) => ({
    // ------ Boards ------
    getBoards: builder.query<GetBoardsResponse[], void>({
      query: () => "/boards",
      transformResponse: (raw: { data: GetBoardsResponse[] }) => raw.data,
      providesTags: ["Boards"],
    }),

    /** Задачи конкретной доски */
    getBoardTasks: builder.query<GetTasksOnBoardResponse[], number>({
      query: (boardId) => `/boards/${boardId}`,
      transformResponse: (raw: { data: GetTasksOnBoardResponse[] }) => raw.data,
      providesTags: ["Tasks"],
    }),

    // ------ Tasks ------
    getAllTasks: builder.query<GetTasksResponse[], void>({
      query: () => "/tasks",
      transformResponse: (raw: { data: GetTasksResponse[] }) => raw.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((t) => ({ type: "Tasks" as const, id: t.id })),
              "Tasks",
            ]
          : ["Tasks"],
    }),

    /** Одна задача (GET /tasks/{taskId}) */
    getTaskById: builder.query<GetTaskByIDResponse, number>({
      query: (taskId) => `/tasks/${taskId}`,
      transformResponse: (raw: { data: GetTaskByIDResponse }) => raw.data,
      providesTags: (_result, _error, arg) => [{ type: "Tasks", id: arg }],
    }),

    /** Создать задачу (POST /tasks/create) */
    createTask: builder.mutation<CreateTaskResponse, CreateTaskRequest>({
      query: (body) => ({
        url: "/tasks/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks", "Boards"],
    }),

    /** Обновить задачу (PUT /tasks/update/{taskId}) */
    updateTask: builder.mutation<
      UpdateTaskResponse,
      { taskId: number; data: UpdateTaskRequest }
    >({
      query: ({ taskId, data }) => ({
        url: `/tasks/update/${taskId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Tasks", id: arg.taskId },
        "Tasks",
      ],
    }),

    /** Обновить статус (PUT /tasks/updateStatus/{taskId}) */
    updateTaskStatus: builder.mutation<
      UpdateTaskStatusResponse,
      { taskId: number; data: UpdateTaskStatusRequest }
    >({
      query: ({ taskId, data }) => ({
        url: `/tasks/updateStatus/${taskId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Tasks", id: arg.taskId },
        "Tasks",
      ],
    }),

    // ------ Users ------
    getUsers: builder.query<GetUsersResponse[], void>({
      query: () => "/users",
      transformResponse: (raw: { data: GetUsersResponse[] }) => raw.data,
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useGetBoardTasksQuery,
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useGetUsersQuery,
} = baseApi;
