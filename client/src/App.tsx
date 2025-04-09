import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";

import Header from "./components/Header";
import BoardsPage from "./pages/BoardsPage";
import BoardPage from "./pages/BoardPage";
import IssuesPage from "./pages/IssuesPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<BoardsPage />} />
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/board/:id" element={<BoardPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
