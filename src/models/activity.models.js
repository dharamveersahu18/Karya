import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    // User who performed the action
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Project where activity happened
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // Type of activity
    type: {
      type: String,
      enum: [
        "PROJECT_CREATED",
        "PROJECT_UPDATED",
        "MEMBER_ADDED",
        "MEMBER_REMOVED",
        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_ASSIGNED",
        "TASK_COMPLETED",
        "TASK_DELETED",
        "COMMENT_ADDED",
        "COMMENT_UPDATED",
        "COMMENT_DELETED",
      ],
      required: true,
    },

    // Human-readable activity message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional related task
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    // Optional related comment
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  },
);

export const Activity = mongoose.model("Activity", activitySchema);
