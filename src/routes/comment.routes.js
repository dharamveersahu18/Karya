import { Router } from "express";

import {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment
} from "../controllers/comment.Controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

const router = Router();

// Create comment
router.post("/", verifyJWT, createComment);
router.get("/:taskId", verifyJWT, getTaskComments);
router.patch("/:commentId", verifyJWT, updateComment);
router.delete("/:commentId", verifyJWT, deleteComment);
export default router;
