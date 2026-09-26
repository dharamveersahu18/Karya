import { Router } from "express";

import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/Task.Controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

const router = Router();

// Create a new task
router.post("/", verifyJWT, createTask);
router.get("/project/:projectId", verifyJWT, getProjectTasks);
router.get("/:taskId", verifyJWT, getTaskById);
router.patch("/:taskId", verifyJWT, updateTask);
router.delete("/:taskId", verifyJWT, deleteTask);
export default router;
