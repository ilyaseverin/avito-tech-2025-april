/**
 * # Columns.tsx
 * Компонент для отображения задач в колонках (Backlog, InProgress, Done).
 *
 * @packageDocumentation
 */

import React, { useState, useCallback } from "react";
import { Box, Paper, Typography } from "@mui/material";
import DraggableCard from "./DraggableCard";
import { ColumnsProps } from "../types/interfaces";

type ColumnStatus = "Backlog" | "InProgress" | "Done";

const Columns: React.FC<ColumnsProps> = ({
  backlog,
  inProgress,
  done,
  onCardClick,
  onStatusChange,
}) => {
  const [dragOverStatus, setDragOverStatus] = useState<ColumnStatus | null>(
    null
  );

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    status: ColumnStatus
  ) => {
    event.preventDefault();
    setDragOverStatus(status);
  };

  const handleDragLeave = useCallback(() => {
    setDragOverStatus(null);
  }, []);

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    newStatus: ColumnStatus
  ) => {
    event.preventDefault();
    setDragOverStatus(null);
    const data = event.dataTransfer.getData("application/json");
    if (data) {
      try {
        const { taskId, currentStatus } = JSON.parse(data);
        if (currentStatus !== newStatus) {
          onStatusChange(taskId, newStatus);
        }
      } catch (error) {
        console.error("Ошибка при обработке данных DnD:", error);
      }
    }
  };

  const getColumnStyle = useCallback(
    (status: ColumnStatus) => ({
      backgroundColor: dragOverStatus === status ? "#f0f8ff" : "inherit",
      transition: "background-color 0.3s",
    }),
    [dragOverStatus]
  );

  const columns = [
    { title: "Backlog", tasks: backlog, status: "Backlog" as ColumnStatus },
    {
      title: "In Progress",
      tasks: inProgress,
      status: "InProgress" as ColumnStatus,
    },
    { title: "Done", tasks: done, status: "Done" as ColumnStatus },
  ];

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {columns.map((col) => (
        <Paper
          key={col.status}
          sx={{ flex: 1, p: 2, ...getColumnStyle(col.status) }}
          onDragOver={(e) => handleDragOver(e, col.status)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, col.status)}
        >
          <Typography variant="h5" gutterBottom>
            {col.title}
          </Typography>
          {col.tasks.map((task) => (
            <DraggableCard
              key={task.id}
              task={task}
              onCardClick={onCardClick}
            />
          ))}
        </Paper>
      ))}
    </Box>
  );
};

export default React.memo(Columns);
