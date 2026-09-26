import { Notification } from "../models/notification.models.js";

 const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  project,
  task,
}) => {
  return await Notification.create({
    recipient,
    sender,
    type,
    message,
    project,
    task,
  });
};

export { createNotification };
