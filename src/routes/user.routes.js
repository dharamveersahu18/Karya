import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
  uploadAvatar,
  getAllUsers
} from "../controllers/user.Controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middlewares.js";
const router = Router();
router.post("/register", registerUser);
router.route("/avatar").post(verifyJWT, upload.single("avatar"), uploadAvatar);
router.post("/login", loginUser);
router.get("/", verifyJWT, getAllUsers);
router.get("/profile", verifyJWT, getCurrentUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
export default router;
