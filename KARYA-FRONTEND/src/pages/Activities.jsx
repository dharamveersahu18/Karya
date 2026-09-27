import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectActivities } from "../services/activityApi";
import {
  Activity as ActivityIcon,
  CheckCircle2,
  MessageSquare,
  UserPlus,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

function Activities() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getProjectActivities(projectId);

        console.log("Activities response:", response);

        setActivities(response.data || []);
      } catch (error) {
        console.error("Activities error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load activities"
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchActivities();
    }
  }, [projectId]);

  const getActivityIcon = (type) => {
    switch (type) {
      case "TASK_CREATED":
        return <Plus size={18} />;

      case "TASK_UPDATED":
        return <Pencil size={18} />;

      case "TASK_ASSIGNED":
        return <UserPlus size={18} />;

      case "COMMENT_CREATED":
        return <MessageSquare size={18} />;

      case "COMMENT_UPDATED":
        return <Pencil size={18} />;

      case "COMMENT_DELETED":
        return <Trash2 size={18} />;

      case "TASK_COMPLETED":
        return <CheckCircle2 size={18} />;

      default:
        return <ActivityIcon size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading activities...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">

      <button
        onClick={() => navigate("/projects")}
        className="mb-5 text-sm text-slate-400 hover:text-white"
      >
        ← Back to Projects
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Project Activity
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Track what is happening in this project.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <ActivityIcon
            size={32}
            className="mx-auto text-slate-500"
          />

          <p className="mt-3 text-slate-400">
            No activity yet.
          </p>
        </div>
      ) : (
        <div className="relative">

          {/* Timeline line */}
          <div className="absolute left-5 top-0 h-full w-px bg-slate-800" />

          <div className="space-y-6">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="relative flex gap-4"
              >

                {/* Icon */}
                <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-lime-400">
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity Card */}
                <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900 p-5">

                  <p className="font-medium">
                    {activity.message ||
                      activity.type ||
                      "Activity"}
                  </p>

                  {activity.user && (
                    <p className="mt-2 text-sm text-slate-400">
                      By{" "}
                      <span className="text-slate-300">
                        {activity.user.fullName ||
                          activity.user.username}
                      </span>
                    </p>
                  )}

                  {activity.task && (
                    <p className="mt-2 text-sm text-slate-500">
                      Task: {activity.task.title}
                    </p>
                  )}

                  {activity.comment && (
                    <p className="mt-2 rounded-lg bg-slate-800 p-3 text-sm text-slate-400">
                      "{activity.comment.content}"
                    </p>
                  )}

                  <p className="mt-3 text-xs text-slate-600">
                    {activity.createdAt
                      ? new Date(
                          activity.createdAt
                        ).toLocaleString()
                      : ""}
                  </p>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Activities;