import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import MainLayout from "../components/Layout";
import ProtectedRoute from "./ProctectedRoute";
import Dashboard from "../pages/Dashboard";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<h1>Register Page</h1>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Main Application Layout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/projects" element={<h1>Projects Page</h1>} />

            <Route path="/tasks" element={<h1>Tasks Page</h1>} />

            <Route
              path="/notifications"
              element={<h1>Notifications Page</h1>}
            />

            <Route path="/profile" element={<h1>Profile Page</h1>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
