/**
 * @file Header.tsx
 * @description Верхняя панель с вкладками навигации (Доски / Все задачи) + кнопка "Создать задачу".
 */

import React, { useState } from "react";
import { AppBar, Toolbar, Button, Box, Tabs, Tab } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import TaskModal from "./TaskModal";

const Header: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();

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
          <Tabs
            value={currentTab}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "white" },
              "& .MuiTab-root": { color: "white" },
              "& .Mui-selected": { color: "white" },
            }}
          >
            <Tab label="Доски" value="/boards" component={Link} to="/boards" />
            <Tab
              label="Все задачи"
              value="/issues"
              component={Link}
              to="/issues"
            />
          </Tabs>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="info"
            onClick={() => setOpenModal(true)}
          >
            Создать задачу
          </Button>
        </Toolbar>
      </AppBar>

      {openModal && (
        <TaskModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          isBoardLocked={false}
          showGoToBoardButton={false}
        />
      )}
    </>
  );
};

export default Header;
