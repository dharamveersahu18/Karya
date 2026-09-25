import { Activity } from "../models/activity.models.js";
import { Project } from "../models/project.models.js";
import { ApiError } from "../utitles/ApiError.js";
import { ApiResponse } from "../utitles/ApiResponse.js";
import { asyncHandler } from "../utitles/asynhandler.js";


// GET PROJECT ACTIVITIES
const getProjectActivities = asyncHandler(async (req, res) => {

    const { projectId } = req.params;

    // 1. Check project ID
    if (!projectId) {
        throw new ApiError(400, "Project ID is required");
    }

    // 2. Find project
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // 3. Check whether current user is owner
    const isOwner =
        project.owner.toString() === req.user._id.toString();

    // 4. Check whether current user is member
    const isMember = project.members.some(
        (memberId) =>
            memberId.toString() === req.user._id.toString()
    );

    // 5. Only owner/member can view activities
    if (!isOwner && !isMember) {
        throw new ApiError(
            403,
            "You are not authorized to view project activities"
        );
    }

    // 6. Get activities
    const activities = await Activity.find({
        project: projectId
    })
        .populate("user", "username email fullName")
        .populate("task", "title status priority")
        .populate("comment", "content")
        .sort({ createdAt: -1 });

    // 7. Return response
    return res.status(200).json(
        new ApiResponse(
            200,
            activities,
            "Project activities fetched successfully"
        )
    );
});


export {
    getProjectActivities
};