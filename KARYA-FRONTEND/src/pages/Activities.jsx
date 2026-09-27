import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectActivities } from "../services/activityApi";

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
        onClick={() =>
          navigate("/projects")
        }
        className="mb-5 text-sm text-slate-400 hover:text-white"
      >
        ← Back to Project
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Project Activity
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Recent activity in this project.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
          No activity yet.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium">
                    {activity.message ||
                      activity.type ||
                      "Activity"}
                  </p>

                  {activity.user && (
                    <p className="mt-1 text-sm text-slate-400">
                      By{" "}
                      {activity.user.fullName ||
                        activity.user.username}
                    </p>
                  )}

                  {activity.task && (
                    <p className="mt-1 text-sm text-slate-500">
                      Task: {activity.task.title}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-600">
                    {activity.createdAt
                      ? new Date(
                          activity.createdAt
                        ).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Activities;