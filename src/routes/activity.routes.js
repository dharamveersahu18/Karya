import { Router } from "express";

import { getProjectActivities } from "../controllers/Activity.Controller.js";

import { verifyJWT } from "../Middlewares/auth.middleware.js";

const router = Router();

router.get("/project/:projectId", verifyJWT, getProjectActivities);

export default router;
