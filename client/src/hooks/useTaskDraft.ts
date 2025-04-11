/**
 * @file useTaskDraft.ts
 * @description Хук для сохранения черновика задачи в localStorage.
 */

import { useState, useEffect } from "react";
import type { Priority } from "../types/models";

export interface TaskDraft {
  title: string;
  description: string;
  priority: Priority;
  boardValue: string;
  assigneeValue: string;
}

/**
 * Хук useTaskDraft сохраняет / читает из localStorage черновик задачи
 * @param key ключ хранения
 * @param initialValue начальное значение
 * @returns { draft, setDraft, clearDraft }
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
