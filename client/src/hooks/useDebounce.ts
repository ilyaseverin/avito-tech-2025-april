/**
 * # useDebounce.ts
 * Хук для задержки (debounce) значения (по умолчанию 300 мс).
 *
 * @packageDocumentation
 */

import { useState, useEffect } from "react";

/**
 * Возвращает дебаунсированное значение.
 *
 * @param value Исходное значение
 * @param delay Задержка в мс
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
