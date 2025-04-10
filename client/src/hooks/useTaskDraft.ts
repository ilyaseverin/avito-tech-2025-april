// src/hooks/useTaskDraft.ts
import { useState, useEffect } from "react";
import type { Priority } from "../types/models"; // Импортируйте тип Priority

export interface TaskDraft {
  title: string;
  description: string;
  priority: Priority; // изменено с string на Priority
  boardValue: string;
  assigneeValue: string;
}

/**
 * Хук useTaskDraft сохраняет и считывает данные черновика из localStorage с заданным ключом.
 *
 * @param key - ключ для хранения
 * @param initialValue - начальное значение
 * @returns Объект с текущим значением, функцией обновления и функцией очистки
 */
export function useTaskDraft(
  key: string,
  initialValue: TaskDraft
): {
  draft: TaskDraft;
  setDraft: (newDraft: TaskDraft) => void;
  clearDraft: () => void;
} {
  const [draft, setDraftState] = useState<TaskDraft>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Ошибка загрузки черновика:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(draft));
    } catch (error) {
      console.error("Ошибка сохранения черновика:", error);
    }
  }, [key, draft]);

  const setDraft = (newDraft: TaskDraft) => {
    setDraftState(newDraft);
  };

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(key);
      setDraftState(initialValue);
    } catch (error) {
      console.error("Ошибка очистки черновика:", error);
    }
  };

  return { draft, setDraft, clearDraft };
}
