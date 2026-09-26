import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} from "../controllers/Project.Controller.js";

const router = Router();

router.post("/", verifyJWT, createProject);
router.get("/", verifyJWT, getProjects);
router.post("/projectId/members", verifyJWT, addMember)
router.delete("/:projectId",verifyJWT, getProjectById)
router.get("/:projectId", verifyJWT, getProjectById); // through url access
router.patch("/:projectId", verifyJWT, updateProject);//update
router.delete("/:projectId", verifyJWT, deleteProject)

export default router;
