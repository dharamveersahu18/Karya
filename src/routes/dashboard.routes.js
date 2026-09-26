import { Router } from "express";
import { getDashboard } from "../controllers/dashBoard.Controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJWT, getDashboard);

export default router;