/**
 * @file formTypes.ts
 * @description Типы для React Hook Form при создании/редактировании задачи.
 */

import type { Priority, Status } from "./models";

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  status: Status; // при редактировании
  boardValue: string;
  assigneeValue: string;
}
