import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "./pages/auth/AuthLayout.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.tsx";
import Board from "./pages/dashboard/board.tsx";
import Overview from "./pages/dashboard/overview.tsx";
import List from "./pages/dashboard/list.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route path="overview" element={<Overview />} />
          <Route path="board" element={<Board />} />
          <Route path="list" element={<List />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
