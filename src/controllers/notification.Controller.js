import {Notification} from "../models/notification.models.js"

import { ApiError } from "../utitles/ApiError.js";
import { ApiResponse } from "../utitles/ApiResponse.js";
import { asyncHandler } from "../utitles/asynhandler.js";

const getMyNotification = asyncHandler(async(req,res)=>{
  //find notification for logged in user
  const notifications = await Notification.find({
    recepient:  req.user._id
  }).populate(
    "sender","username email fullName"
  ).populate("projects", "name status")
  .sort({createdAt: -1});

  return res.status(200).json(
    new ApiResponse(200, notifications,"Notifications fetched successfully")
  )
})

// create notification

const createNotification = asyncHandler(async (req, res) => {
    const {
        recipient,
        type,
        message,
        project,
        task
    } = req.body;

    // 1. Check required fields
    if (!recipient || !type || !message) {
        throw new ApiError(
            400,
            "Recipient, type and message are required"
        );
    }

    // 2. Create notification
    const notification = await Notification.create({
        recipient,
        sender: req.user._id,
        type,
        message,
        project,
        task
    });

    // 3. Return response
    return res.status(201).json(
        new ApiResponse(
            201,
            notification,
            "Notification created successfully"
        )
    );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    // Check notification ID
    if (!notificationId) {
        throw new ApiError(400, "Notification ID is required");
    }

    // Find notification belonging to logged-in user
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: req.user._id,
    });

    // Notification not found
    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    // Mark as read
    notification.isRead = true;

    // Save changes
    await notification.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            notification,
            "Notification marked as read"
        )
    );
});

const deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    // Check notification ID
    if (!notificationId) {
        throw new ApiError(400, "Notification ID is required");
    }

    // Find notification belonging to logged-in user
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: req.user._id,
    });

    // Notification not found
    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    // Delete notification
    await Notification.findByIdAndDelete(notificationId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Notification deleted successfully"
        )
    );
});
export {getMyNotification, createNotification,markNotificationAsRead,deleteNotification}