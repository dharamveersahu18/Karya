import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getDashboard } from "../services/dashboardApi";
import {getProjects} from "../services/projectApi";
import {
  Activity as ActivityIcon,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  Pencil,
  Plus,
  UserPlus,
  Trash2,
  MessageSquare,
} from "lucide-react";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboard();

      console.log("Dashboard response:", response);

      setDashboard(response?.data);
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(error?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "TASK_CREATED":
        return <Plus size={16} />;

      case "TASK_UPDATED":
        return <Pencil size={16} />;

      case "TASK_ASSIGNED":
        return <UserPlus size={16} />;

      case "COMMENT_CREATED":
        return <MessageSquare size={16} />;

      case "COMMENT_UPDATED":
        return <Pencil size={16} />;

      case "COMMENT_DELETED":
        return <Trash2 size={16} />;

      case "TASK_COMPLETED":
        return <CheckCircle2 size={16} />;

      default:
        return <ActivityIcon size={16} />;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboard} />;
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-2 text-slate-400">Welcome back to TaskForge.</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Projects */}
        <Link
          to="/projects"
          className="block rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-lime-500/40"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Projects</p>

            <FolderKanban size={20} className="text-lime-400" />
          </div>

          <h2 className="mt-2 text-3xl font-bold">
            {dashboard?.statistics?.totalProjects ?? 0}
          </h2>
        </Link>

        {/* Tasks */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Tasks</p>

            <ListTodo size={20} className="text-lime-400" />
          </div>

          <h2 className="mt-2 text-3xl font-bold">
            {dashboard?.statistics?.totalTasks ?? 0}
          </h2>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Completed</p>

            <CheckCircle2 size={20} className="text-lime-400" />
          </div>

          <h2 className="mt-2 text-3xl font-bold">
            {dashboard?.statistics?.completedTasks ?? 0}
          </h2>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Pending</p>

            <Clock3 size={20} className="text-lime-400" />
          </div>

          <h2 className="mt-2 text-3xl font-bold">
            {dashboard?.statistics?.pendingTasks ?? 0}
          </h2>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ActivityIcon size={22} className="text-lime-400" />

              <div>
                <h2 className="text-xl font-semibold">Recent Activity</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest activity in your workspace
                </p>
              </div>
            </div>

            <Link
              to="/projects"
              className="text-xs text-slate-400 hover:text-lime-400"
            >
              View Projects
            </Link>
          </div>

          {dashboard?.recentActivities?.length === 0 ? (
            <p className="text-sm text-slate-500">No recent activity.</p>
          ) : (
            <div className="space-y-4">
              {dashboard?.recentActivities?.map((activity) => (
                <div key={activity?._id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-lime-400">
                    {getActivityIcon(activity?.type)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-200">
                      {activity?.message || activity?.type || "Activity"}
                    </p>

                    {activity?.task && (
                      <p className="mt-1 text-xs text-slate-500">
                        Task: {activity.task.title}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-slate-600">
                      {activity?.createdAt
                        ? new Date(activity.createdAt).toLocaleString()
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Recent Tasks */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">My Recent Tasks</h2>

              <p className="mt-1 text-sm text-slate-500">
                Recently assigned tasks
              </p>
            </div>

            <ListTodo size={22} className="text-lime-400" />
          </div>

          {dashboard?.myTasks?.length === 0 ? (
            <p className="text-sm text-slate-500">No tasks assigned.</p>
          ) : (
            <div className="space-y-3">
              {dashboard?.myTasks?.map((task) => (
                <Link
                  to={`/projects/${task?.project?._id || task?.project}/tasks/${task?._id}`}
                  key={task?._id}
                  className="block rounded-lg border border-slate-800 bg-slate-950 p-4 transition hover:border-lime-500/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium">{task?.title}</h3>

                    <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                      {task?.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Priority: {task?.priority || "N/A"}
                  </p>

                  {task?.dueDate && (
                    <p className="mt-1 text-xs text-slate-600">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Recent Projects</h2>

          <p className="mt-1 text-sm text-slate-500">
            Your recently created or joined projects
          </p>
        </div>

        {dashboard?.recentProjects?.length === 0 ? (
          <p className="text-sm text-slate-500">No projects found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dashboard?.recentProjects?.map((project) => (
              <Link
                key={project?._id}
                to={`/projects/${project?._id}/tasks`}
                className="block rounded-lg border border-slate-800 bg-slate-950 p-4 transition hover:border-lime-500/40 hover:bg-slate-900"
              >
                <h3 className="font-medium">{project?.name}</h3>

                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {project?.description || "No description"}
                </p>

                <p className="mt-3 text-xs text-slate-600">
                  Created:{" "}
                  {project?.createdAt
                    ? new Date(project.createdAt).toLocaleDateString()
                    : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
