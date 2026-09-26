// configuration

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import commentRouter from "./routes/comment.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import activityRouter from "./routes/activity.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

// ==================== MIDDLEWARE ====================

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==================== ROUTES ====================

app.use("/api/v1/users", userRouter);

app.use("/api/v1/projects", projectRouter);

app.use("/api/v1/tasks", taskRouter);

app.use("/api/v1/comments", commentRouter);

app.use("/api/v1/notifications", notificationRouter);

app.use("/api/v1/activities", activityRouter);

app.use("/api/v1/dashboard", dashboardRoutes);

// ==================== HEALTH CHECK ====================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "TaskForge API is running",
    });
});

export default app;