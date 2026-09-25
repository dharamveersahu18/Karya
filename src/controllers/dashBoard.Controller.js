import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Notification } from "../models/notification.models.js";
import { asyncHandler } from "../utitles/asynhandler.js";
import { ApiResponse } from "../utitles/ApiResponse.js";
//  dashbpard 
const getDashboard = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    // Count projects where user is owner or member
    const totalProjects = await Project.countDocuments({
        $or: [
            { owner: userId },
            { members: userId }
        ]
    });

    // Total tasks assigned to logged-in user
    const totalTasks = await Task.countDocuments({
        assignedTo: userId
    });

    // Completed tasks
    const completedTasks = await Task.countDocuments({
        assignedTo: userId,
        status: "completed"
    });

    // Pending tasks
    const pendingTasks = await Task.countDocuments({
        assignedTo: userId,
        status: { $ne: "completed" }
    });

    // Recent projects
    const recentProjects = await Project.find({
        $or: [
            { owner: userId },
            { members: userId }
        ]
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name description status priority createdAt");

    // My recent tasks
    const myTasks = await Task.find({
        assignedTo: userId
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title description status priority dueDate project");

    // Recent notifications
    const recentNotifications = await Notification.find({
        user: userId
    })
        .sort({ createdAt: -1 })
        .limit(5);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                statistics: {
                    totalProjects,
                    totalTasks,
                    completedTasks,
                    pendingTasks
                },
                recentProjects,
                myTasks,
                recentNotifications
            },
            "Dashboard data fetched successfully"
        )
    );
});

export { getDashboard };