import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectMembers,
} from "../controllers/project.Controller.js";

const router = Router();

router.post("/", verifyJWT, createProject);

router.get("/", verifyJWT, getProjects);

router.post("/:projectId/members", verifyJWT, addMember);

router.delete("/:projectId/members/:userId", verifyJWT, removeMember);

router.get("/:projectId/members", verifyJWT, getProjectMembers);

router.get("/:projectId", verifyJWT, getProjectById);

router.patch("/:projectId", verifyJWT, updateProject);

router.delete("/:projectId", verifyJWT, deleteProject);

export default router;
