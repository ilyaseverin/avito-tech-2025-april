/**
 * @file IssuesCard.tsx
 * @description Компонент для отображения карточке задач на странице IssuesPage.tsx
 */

import React from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import type { GetTasksResponse } from "../types/models";

interface IssueCardProps {
  task: GetTasksResponse;
  onClick: (task: GetTasksResponse) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ task, onClick }) => {
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: 2,
        transition: "box-shadow 0.3s ease-in-out",
        ":hover": {
          boxShadow: 6,
        },
        cursor: "pointer",
      }}
    >
      <CardActionArea onClick={() => onClick(task)}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {task.title}
          </Typography>
          <Typography variant="subtitle1">{task.description}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Статус: {task.status}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Доска: {task.boardName}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Исполнитель: {task.assignee.fullName}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default IssueCard;
