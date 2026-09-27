import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Tasks from "../pages/Tasks";
import CreateTask from "../pages/createTask";
import MainLayout from "../components/Layout";
import ProtectedRoute from "./ProctectedRoute";
import EditTask from "../pages/EditTask";
import Notifications from "../pages/Notifications";
import TaskDetails from "../pages/TaskDetails";
import Activities from "../pages/Activities";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/projects"
              element={<Projects />}
            />

    <Route
  path="/projects/:projectId/tasks"
  element={<Tasks />}
/>
<Route
  path="/projects/:projectId/tasks/create"
  element={<CreateTask />}
/>
<Route
  path="/projects/:projectId/tasks/:taskId/edit"
  element={<EditTask />}
/>
<Route
  path="/notifications"
  element={<Notifications />}
/>
<Route
  path="/projects/:projectId/tasks/:taskId"
  element={<TaskDetails />}
/>
<Route
  path="/projects/:projectId/activities"
  element={<Activities />}
/>

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;