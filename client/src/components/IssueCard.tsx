/**
 * # IssueCard.tsx
 * Компонент для отображения карточки задачи на странице IssuesPage.tsx
 *
 * @packageDocumentation
 */

import React from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { IssueCardProps } from "../types/interfaces";

/**
 * Отображает карточку задачи для страницы IssuesPage.
 */
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

export default React.memo(IssueCard);
