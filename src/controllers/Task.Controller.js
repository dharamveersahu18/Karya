import { Task } from "../models/task.models.js";
import { Project } from "../models/project.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utitles/ApiError.js";
import { ApiResponse } from "../utitles/ApiResponse.js";
import { asyncHandler } from "../utitles/asynhandler.js";
import { createNotification } from "../utitles/createNotification.js";
import { createActivity } from "../utitles/createActivity.js";
//create Task
const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, priority, dueDate } =
    req.body;

  // check required fields
  if (!title || !projectId) {
    throw new ApiError(400, "Title and projectId are required");
  }
  // find the project
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  //check wheather current user is owner
  const isOwner = project.owner.toString() === req.user._id.toString();
  // check wheather current user is member
  const isMember = project.members.some(
    (memberId) => memberId.toString() === req.user._id.toString(),
  );
  // only project memeber/ owner can create task
  if (!isOwner && !isMember) {
    throw new ApiError(
      403,
      "You are not aithorized t create a task in this project",
    );
  }
  // if assignedTo is provided ,check user exists
  if (assignedTo) {
    const user = await User.findById(assignedTo);
    if (!user) {
      throw new ApiError(404, "Assignment user not found");
    }
  }
  //create task
  const task = await Task.create({
    title,
    description,
    project: projectId,
    createdBy: req.user._id,
    assignedTo,
priority,
    dueDate,
  });



  // Create notification when task is assigned
  if (assignedTo) {
    await createNotification({
      recipient: assignedTo,
      sender: req.user._id,
      type: "TASK_ASSIGNED",
      message: `You have been assigned a new task: ${title}`,
      project: projectId,
      task: task._id,
    });

      await createActivity({
    user: req.user._id,
    project: projectId,
    type: "TASK_CREATED",
    message: `Task "${title}" was created`,
    task: task._id
});
  }

  //return task
  return res
    .status(201)
    .json(new ApiResponse(201, task, "task created successfully"));
});

// get All ProjectTask

const getProjectTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // 1. Check project ID
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  // 2. Find the project
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // 3. Check whether current user is owner
  const isOwner = project.owner.toString() === req.user._id.toString();

  // 4. Check whether current user is a member
  const isMember = project.members.some(
    (memberId) => memberId.toString() === req.user._id.toString(),
  );

  // 5. Only owner/member can view tasks
  if (!isOwner && !isMember) {
    throw new ApiError(403, "You are not authorized to view these tasks");
  }

  // 6. Find all tasks of this project
  const tasks = await Task.find({
    project: projectId,
  })
    .populate("createdBy", "username email fullName")
    .populate("assignedTo", "username email fullName")
    .sort({ createdAt: -1 });

  // 7. Send response
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

// getproject Tasks
const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new ApiError(400, "Task Id is required");
  }

  // find the task
  const task = await Task.findById(taskId)
    .populate("project", "name description status")
    .populate("createdBy", "username email fullName")
    .populate("assignedTo", "username email fullName");

  // check task exists
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // check project access
  const project = await Project.findById(task.project._id);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  // check owner
  const isOwner = project.owner.toString() === req.user._id.toString();

  // check member
  const isMember = project.members.some(
    (memberId) => memberId.toString() === req.user._id.toString(),
  );

  // only  owner / member can view task
  if (!isOwner && !isMember) {
    throw new ApiError(403, "You are not authorized to view this task");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fecthed Successfully"));
});

// update task
const updateTask = asyncHandler(async (req, res) => {
  // data comes from
  const { taskId } = req.params;

  const { title, description, status, priority, assignedTo, dueDate } =
    req.body;

  // check task Id
  if (!taskId) {
    throw (new ApiError(400), "task Field is required");
  }
  //find task
  const task = await Task.findById(taskId);
  if (!task) {
    throw (new ApiError(404), "Task not found");
  }

  // find the project
  const project = await Project.findById(task.project);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  // check project member
  const isOwner = project.owner.toString() === req.user._id.toString();

  //check memeber
  const isMember = project.members.some(
    (memberId) => memberId.toString() === req.user._id.toString(),
  );
  //onlky project users can update task
  if (!isOwner && !isMember) {
    throw new ApiError(403, "You are not authorixed to update this task");
  }
  // If assignedTo is provided, check user
  if (assignedTo) {
    const user = await User.findById(assignedTo);

    if (!user) {
      throw new ApiError(404, "Assigned user not found");
    }

    const isAssignedUserMember = project.members.some(
      (memberId) => memberId.toString() === assignedTo.toString(),
    );

    const isAssignedUserOwner =
      project.owner.toString() === assignedTo.toString();

    // Check assigned user belongs to project
    if (!isAssignedUserMember && !isAssignedUserOwner) {
      throw new ApiError(400, "Assigned user is not a member of this project");
    }

    task.assignedTo = assignedTo;
  }
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;

  // Store whether task is being completed
  const isTaskCompleted = status === "COMPLETED" && task.status !== "COMPLETED";

  if (status !== undefined) task.status = status;

  if (priority !== undefined) {
    task.priority = priority;
  }

  if (dueDate !== undefined) {
    task.dueDate = dueDate;
  }

  // save updated task
  const updatedTask = await task.save();

  // ++++++++
  // Notify assigned user when task is completed
  if (
    isTaskCompleted &&
    task.assignedTo &&
    task.assignedTo.toString() !== req.user._id.toString()
  ) {
    await createNotification({
      recipient: task.assignedTo,
      sender: req.user._id,
      type: "TASK_UPDATED",
      message: `Your task "${task.title}" has been updated`,
      project: task.project,
      task: task._id,
    });
    await createActivity({
    user: req.user._id,
    project: task.project,
    type: "TASK_UPDATED",
    message: `Task "${task.title}" was updated`,
    task: task._id
});
  }

  //return response
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

//delete task
const deleteTask = asyncHandler(async (req, res) => {
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

  // 3. Find the project
  const project = await Project.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // 4. Check whether current user is project owner
  const isOwner = project.owner.toString() === req.user._id.toString();

  // 5. Check whether current user is project member
  const isMember = project.members.some(
    (memberId) => memberId.toString() === req.user._id.toString(),
  );

  // 6. Only project owner/member can delete
  if (!isOwner && !isMember) {
    throw new ApiError(403, "You are not authorized to delete this task");
  }

  await createActivity({
    user: req.user._id,
    project: task.project,
    type: "TASK_DELETED",
    message: `Task "${task.title}" was deleted`,
    task: task._id
});

await Task.findByIdAndDelete(taskId);

  // 7. Delete task
  await Task.findByIdAndDelete(taskId);

  // 8. Send response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});
export { createTask, getProjectTasks, getTaskById, updateTask, deleteTask };
