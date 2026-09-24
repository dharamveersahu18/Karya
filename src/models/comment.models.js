import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        // Comment text
        content: {
            type: String,
            required: true,
            trim: true,
        },

        // Task on which the comment is added
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },

        // User who created the comment
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Comment = mongoose.model("Comment", commentSchema);