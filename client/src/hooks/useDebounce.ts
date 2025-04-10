import { useState, useEffect } from "react";

/**
 * Хук useDebounce принимает значение и задержку (в мс) и возвращает "дебаунсированное" значение,
 * которое обновляется только после того, как указанное время прошло без изменений.
 *
 * @param value – исходное значение для дебаунса
 * @param delay – задержка в миллисекундах (по умолчанию 300)
 * @returns дебаунсированное значение
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
