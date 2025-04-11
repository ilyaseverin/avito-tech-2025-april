/**
 * @file DraggableCard.tsx
 * @description Одиночная задача-карточка, которую можно перетаскивать (Drag & Drop).
 */

import React from "react";
import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import type { GetTasksOnBoardResponse } from "../types/models";

interface DraggableCardProps {
  task: GetTasksOnBoardResponse;
  onCardClick: (task: GetTasksOnBoardResponse) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ task, onCardClick }) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({ taskId: task.id, currentStatus: task.status })
    );
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: 2,
        transition: "box-shadow 0.3s ease-in-out",
        ":hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={() => onCardClick(task)}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {task.title}
          </Typography>
          <Typography variant="body2" paragraph>
            {task.description}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Исполнитель: {task.assignee.fullName}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DraggableCard;
