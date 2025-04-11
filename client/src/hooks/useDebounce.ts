/**
 * @file useDebounce.ts
 * @description Хук для задержки (debounce) значения с заданной задержкой (по умолчанию 300 мс).
 */

import { useState, useEffect } from "react";

/**
 * Хук useDebounce возвращает "дебаунсированное" значение
 * @param value Исходное значение
 * @param delay Задержка в мс (по умолчанию 300)
 * @returns Дебаунсированное значение
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
