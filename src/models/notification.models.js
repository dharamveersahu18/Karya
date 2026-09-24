import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        type: {
            type: String,
            enum: [
                "TASK_ASSIGNED",
                "TASK_UPDATED",
                "TASK_COMPLETED",
                "PROJECT_ADDED",
                "COMMENT_ADDED",
            ],
            required: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },

        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Notification = mongoose.model(
    "Notification",
    notificationSchema
);
