import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useMatch } from "react-router-dom";
import TaskModal from "./TaskModal";

const Header: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);

  // Проверяем, совпадает ли текущий роут с /board/:boardId
  const boardMatch = useMatch("/board/:boardId");
  const boardId = boardMatch ? Number(boardMatch.params.boardId) : null;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Project Management
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button component={Link} to="/boards" color="inherit">
              Доски
            </Button>
            <Button component={Link} to="/issues" color="inherit">
              Все задачи
            </Button>
            <Button color="inherit" onClick={() => setOpenModal(true)}>
              Создать задачу
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Модалка для СОЗДАНИЯ задачи */}
      {openModal && (
        <TaskModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          // Без taskId => точно создаём
          // Если мы на /board/:boardId, подставим boardId, НО не блокируем
          defaultBoardId={boardId ?? undefined}
          isBoardLocked={false}
          showGoToBoardButton={false}
        />
      )}
    </>
  );
};

export default Header;
