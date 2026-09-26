import { Router } from "express";

import {
    getMyNotification,
    createNotification,
    markNotificationAsRead,
    deleteNotification,
} from "../controllers/notification.Controller.js";

import { verifyJWT } from "../Middlewares/auth.middleware.js";

const router = Router();

// Get logged-in user's notifications
router.get("/", verifyJWT, getMyNotification);

// Create notification
router.post("/", verifyJWT, createNotification);

// Mark notification as read
router.patch(
    "/:notificationId/read",
    verifyJWT,
    markNotificationAsRead
);

// Delete notification
router.delete(
    "/:notificationId",
    verifyJWT,
    deleteNotification
);

export default router;