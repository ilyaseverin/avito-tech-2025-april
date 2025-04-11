/**
 * @file store.ts
 * @description Конфигурирование Redux store с RTK Query.
 */

import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Типизация
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
