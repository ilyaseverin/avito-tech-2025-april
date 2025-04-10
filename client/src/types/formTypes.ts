// types/formTypes.ts
import type { Priority, Status } from "../types/models";

// Этот интерфейс описывает все поля, которые будет обрабатывать React Hook Form.
export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  status: Status; // В режиме редактирования обязательное поле
  boardValue: string; // ID доски в строковом формате
  assigneeValue: string; // ID исполнителя в строковом формате
}
