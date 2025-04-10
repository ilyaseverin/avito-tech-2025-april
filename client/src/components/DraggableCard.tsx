// src/components/DraggableCard.tsx
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
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
      sx={{ mb: 2, cursor: "pointer" }}
      onClick={() => onCardClick(task)}
    >
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2">{task.description}</Typography>
      </CardContent>
    </Card>
  );
};

export default DraggableCard;
