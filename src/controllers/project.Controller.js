import { Project } from "../models/project.models.js";
import { ApiError } from "../utitles/ApiError.js";
import { ApiResponse } from "../utitles/ApiResponse.js";
import { asyncHandler } from "../utitles/asynhandler.js";
import { User } from "../models/user.models.js";
import { createNotification } from "../utitles/createNotification.js";
import { createActivity } from "../utitles/createActivity.js";

// ======================================================
// CREATE PROJECT
// ======================================================

const createProject = asyncHandler(async (req, res) => {
  const { name, description, startDate, endDate } = req.body;

  // Check required fields
  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  // Create project
  const project = await Project.create({
    name,
    description,
    owner: req.user._id,
    members: [],
    status: "PLANNING",
    startDate,
    endDate,
  });

  // Create activity
  await createActivity({
    user: req.user._id,
    project: project._id,
    type: "PROJECT_CREATED",
    message: `Project "${project.name}" was created`,
  });

  // Return response
  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

// ======================================================
// GET ALL PROJECTS
// ======================================================

const getProjects = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const projects = await Project.find({
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate("owner", "username email fullName")
    .populate("members", "username email fullName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

// ======================================================
// GET SINGLE PROJECT
// ======================================================

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Check project ID
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  // Find project
  const project = await Project.findById(projectId)
    .populate("owner", "username email fullName")
    .populate("members", "username email fullName");

  // Project not found
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const userId = req.user._id.toString();

  // Check owner
  const isOwner = project.owner._id.toString() === userId;

  // Check member
  const isMember = project.members.some(
    (member) => member._id.toString() === userId,
  );

  // Authorization
  if (!isOwner && !isMember) {
    throw new ApiError(403, "You are not authorized to view this project");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

// ======================================================
// UPDATE PROJECT
// ======================================================

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const { name, description, startDate, endDate, status } = req.body;

  // Check project ID
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  // Find project
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Only owner can update
  if (project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only project owner can update the project");
  }

  // Update only provided fields
  if (name !== undefined) {
    project.name = name;
  }

  if (description !== undefined) {
    project.description = description;
  }

  if (startDate !== undefined) {
    project.startDate = startDate;
  }

  if (endDate !== undefined) {
    project.endDate = endDate;
  }

  if (status !== undefined) {
    project.status = status;
  }

  // Save project
  const updatedProject = await project.save();

  // Create activity
  await createActivity({
    user: req.user._id,
    project: project._id,
    type: "PROJECT_UPDATED",
    message: `Project "${project.name}" was updated`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProject, "Project updated successfully"));
});

// ======================================================
// DELETE PROJECT
// ======================================================

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Check project ID
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  // Find project
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Only owner can delete
  if (project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only project owner can delete the project");
  }

  // Delete project
  await project.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project deleted successfully"));
});

// ======================================================
// ADD MEMBER
// ======================================================

const addMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { username } = req.body;

  // Check required data
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  // Find project
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Only owner can add members
  if (project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only project owner can add members");
  }

  // Find user
  const user = await User.findOne({
    username: username.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Don't add owner
  if (project.owner.toString() === user._id.toString()) {
    throw new ApiError(400, "Project owner is already part of the project");
  }

  // Check if already member
  const alreadyMember = project.members.some(
    (memberId) => memberId.toString() === user._id.toString(),
  );

  if (alreadyMember) {
    throw new ApiError(409, "User is already a member of this project");
  }

  // Add member
  project.members.push(user._id);

  // Save project
  const updatedProject = await project.save();

  // Create notification
  await createNotification({
    recipient: user._id,
    sender: req.user._id,
    type: "PROJECT_ADDED",
    message: `You have been added to project: ${project.name}`,
    project: project._id,
  });

  // Create activity
  await createActivity({
    user: req.user._id,
    project: project._id,
    type: "MEMBER_ADDED",
    message: `A new member was added to project "${project.name}"`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProject, "Member added successfully"));
});

// ======================================================
// REMOVE MEMBER
// ======================================================

const removeMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  // Check project ID
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  // Check member ID
  if (!memberId) {
    throw new ApiError(400, "Member ID is required");
  }

  // Find project
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Only owner can remove members
  if (project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only project owner can remove members");
  }

  // Check member exists
  const memberExists = project.members.some(
    (memberIdFromProject) =>
      memberIdFromProject.toString() === memberId.toString(),
  );

  if (!memberExists) {
    throw new ApiError(404, "Member not found in this project");
  }

  // Remove member
  project.members = project.members.filter(
    (memberIdFromProject) =>
      memberIdFromProject.toString() !== memberId.toString(),
  );

  // Save project
  const updatedProject = await project.save();

  // Create activity
  await createActivity({
    user: req.user._id,
    project: project._id,
    type: "MEMBER_REMOVED",
    message: `A member was removed from project "${project.name}"`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProject, "Member removed successfully"));
});

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
