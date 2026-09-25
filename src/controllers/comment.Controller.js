import { Comment } from "../models/comment.models.js";
import { Task } from "../models/task.models.js";
import { ApiError } from "../utitles/ApiError.js";
import { ApiResponse } from "../utitles/ApiResponse.js";
import { asyncHandler } from "../utitles/asynhandler.js";
import { createActivity } from "../utitles/createActivity.js";
import { createNotification } from "../utitles/createNotification.js";

const createComment = asyncHandler(async (req, res) => {
  const { content, taskId } = req.body;

  if (!content || !taskId) {
    throw new ApiError(400, "comment content and TaskId are required");
  }

  // find task
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const project = await Project.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // check project owner
  const isOwner = project.owner.toString() === req.user._id.toString();

  // 6. Only project users can comment
  if (!isOwner && !isMember) {
    throw new ApiError(403, "You are not authorized to comment on this task");
  }
  // 7. Create comment
  const comment = await Comment.create({
    content,
    author: req.user._id,
    task: taskId,
  });

  // +++++++
  // Notify assigned user about the new comment

  if (
    task.assignedTo &&
    task.assignedTo.toString() !== req.user._id.toString()
  ) {
    await createNotification({
      recipient: task.assignedTo,
      sender: req.user._id,
      type: "COMMENT_ADDED",
      message: `New comment added to your task: ${task.title}`,
      project: task.project,
      task: task._id,
    });

    await createActivity({
      user: req.user._id,
      project: task.project,
      type: "COMMENT_ADDED",
      message: `A comment was added to task "${task.title}"`,
      task: task._id,
      comment: comment._id,
    });
  }
  /// ============
  // 8. Return created comment
  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

// get task comments
const getTaskComments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  // 1. Check task ID
  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  // 2. Find task
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // 3. Find project
  const project = await Project.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // 4. Check project owner
  const isOwner = project.owner.toString() === req.user._id.toString();

  // 5. Check project member
  const isMember = project.members.some(
    (memberId) => memberId.toString() === req.user._id.toString(),
  );

  // 6. Only project users can view comments
  if (!isOwner && !isMember) {
    throw new ApiError(403, "You are not authorized to view these comments");
  }

  // 7. Find all comments of this task
  const comments = await Comment.find({
    task: taskId,
  })
    .populate("author", "username email fullName")
    .sort({ createdAt: -1 });

  // 8. Send response
  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

// update task
// update comment
const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;
    const { content } = req.body || {};

    // check required field
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    // find comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // check whether current user is the author
    if (
        comment.author.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "Only the comment author can update this comment"
        );
    }

    // find related task
    const task = await Task.findById(comment.task);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // update content
    comment.content = content;

    // save
    const updatedComment = await comment.save();

    // create activity
    await createActivity({
        user: req.user._id,
        project: task.project,
        type: "COMMENT_UPDATED",
        message: `A comment was updated on task "${task.title}"`,
        task: task._id,
        comment: comment._id
    });

    // send response
    return res.status(200).json(
        new ApiResponse(
            200,
            updatedComment,
            "Comment updated successfully"
        )
    );
})
// delete comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, " comment Id is required");
  }
  // find comment
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment not found");
  }
  // 3. Check whether current user is the author
  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the comment author can delete this comment");
  }
  await createActivity({
    user: req.user._id,
    project: task.project,
    type: "COMMENT_DELETED",
    message: `A comment was deleted from task "${task.title}"`,
    task: task._id,
    comment: comment._id,
  });

  await comment.deleteOne();
  // 4. Delete comment
  await Comment.findByIdAndDelete(commentId);

  // 5. Send response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});
export { createComment, getTaskComments, deleteComment, updateComment };
