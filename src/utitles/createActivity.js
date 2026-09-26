import { Activity } from "../models/activity.models.js";

const createActivity = async ({
    user,
    project,
    type,
    message,
    task,
    comment
}) => {
    return await Activity.create({
        user,
        project,
        type,
        message,
        task,
        comment
    });
};

export { createActivity };