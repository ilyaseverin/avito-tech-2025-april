// src/components/Header.tsx

import React, { useState } from "react";
import { AppBar, Toolbar, Button, Box, Tabs, Tab } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import TaskModal from "./TaskModal";

const Header: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();

  // Определяем активную вкладку: если путь начинается с /issues – это вкладка "Все задачи",
  // если с /boards или /board/ – вкладка "Доски".
  let currentTab = "";
  if (location.pathname.startsWith("/issues")) {
    currentTab = "/issues";
  } else if (
    location.pathname.startsWith("/boards") ||
    location.pathname.startsWith("/board/")
  ) {
    currentTab = "/boards";
  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {/* Вкладки размещены слева */}
          <Tabs
            value={currentTab}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Доски" value="/boards" component={Link} to="/boards" />
            <Tab
              label="Все задачи"
              value="/issues"
              component={Link}
              to="/issues"
            />
          </Tabs>
          <Box sx={{ flexGrow: 1 }} /> {/* Растягивающийся spacer */}
          {/* Кнопка создания задачи остается справа */}
          <Button
            variant="contained"
            color="info"
            onClick={() => setOpenModal(true)}
          >
            Создать задачу
          </Button>
        </Toolbar>
      </AppBar>

      {/* Модальное окно для создания задачи */}
      {openModal && (
        <TaskModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          // Если вы на странице доски, можно передать defaultBoardId здесь
          isBoardLocked={false}
          showGoToBoardButton={false}
        />
      )}
    </>
  );
};

export default Header;
