import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllTasks, deleteTask } from "../services/taskApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

function AllTasks() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get("status");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllTasks();

      console.log("All tasks response:", response);

      setTasks(response?.data || []);
    } catch (error) {
      console.error("All tasks error:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Delete task
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task?._id !== taskId)
      );
    } catch (error) {
      console.error("Delete task error:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  // Filter tasks according to URL
  const filteredTasks = statusFilter
    ? tasks.filter(
        (task) =>
          task?.status?.toLowerCase() ===
          statusFilter.toLowerCase()
      )
    : tasks;

  // Page title
  const pageTitle =
    statusFilter === "completed"
      ? "Completed Tasks"
      : statusFilter === "pending"
        ? "Pending Tasks"
        : statusFilter === "todo"
          ? "Todo Tasks"
          : "All Tasks";

  const pageDescription =
    statusFilter === "completed"
      ? "View all completed tasks across your projects."
      : statusFilter === "pending"
        ? "View all tasks currently in progress."
        : statusFilter === "todo"
          ? "View all tasks waiting to be started."
          : "View and manage tasks across all your projects.";

  if (loading) {
    return <LoadingSpinner text="Loading tasks..." />;
  }

  if (error && tasks.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchTasks}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-lime-400">
            Task Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            {pageTitle}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {pageDescription}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/tasks")}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
              !statusFilter
                ? "border-lime-500/30 bg-lime-500/10 text-lime-400"
                : "border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            All
          </button>

          <button
            onClick={() => navigate("/tasks?status=todo")}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
              statusFilter === "todo"
                ? "border-lime-500/30 bg-lime-500/10 text-lime-400"
                : "border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            Todo
          </button>

          <button
            onClick={() => navigate("/tasks?status=pending")}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
              statusFilter === "pending"
                ? "border-lime-500/30 bg-lime-500/10 text-lime-400"
                : "border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            In Progress
          </button>

          <button
            onClick={() => navigate("/tasks?status=completed")}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
              statusFilter === "completed"
                ? "border-lime-500/30 bg-lime-500/10 text-lime-400"
                : "border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Task count */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filteredTasks.length}{" "}
          {filteredTasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title={
            statusFilter
              ? `No ${statusFilter} tasks`
              : "No tasks yet"
          }
          message={
            statusFilter
              ? "There are no tasks matching this status."
              : "Tasks from your projects will appear here."
          }
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredTasks.map((task) => {
            // Status styling
            const statusStyle =
              task?.status === "completed"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : task?.status === "pending"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20";

            // Priority styling
            const priorityStyle =
              task?.priority === "high"
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : task?.priority === "medium"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-slate-800 text-slate-400 border-slate-700";

            return (
              <div
                key={task?._id}
                className="
                  group relative overflow-hidden
                  rounded-2xl
                  border border-slate-800
                  bg-slate-900/80
                  p-5
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-lime-500/30
                  hover:shadow-xl
                  hover:shadow-lime-500/5
                "
              >
                {/* Glow */}
                <div
                  className="
                    pointer-events-none absolute
                    -right-16 -top-16
                    h-32 w-32
                    rounded-full
                    bg-lime-500/5
                    blur-3xl
                    transition
                    group-hover:bg-lime-500/10
                  "
                />

                {/* Header */}
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-white">
                      {task?.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                      {task?.description ||
                        "No description provided."}
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${statusStyle}`}
                  >
                    {task?.status
                      ?.replaceAll("_", " ")
                      .toUpperCase()}
                  </span>
                </div>

                {/* Project */}
                <div className="relative mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-600">
                    Project
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-300">
                    {task?.project?.name || "Unknown Project"}
                  </p>
                </div>

                {/* Task information */}
                <div className="relative mt-4 grid grid-cols-2 gap-3">
                  {/* Priority */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-600">
                      Priority
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-md border px-2 py-1 text-xs font-medium ${priorityStyle}`}
                    >
                      {task?.priority?.toUpperCase() ||
                        "N/A"}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-600">
                      Due Date
                    </p>

                    <p className="mt-2 text-sm font-medium text-slate-300">
                      {task?.dueDate
                        ? new Date(
                            task.dueDate
                          ).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>
                </div>

                {/* Assigned User */}
                {task?.assignedTo && (
                  <div className="relative mt-4 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-500/10 text-xs font-bold text-lime-400">
                      {(
                        task?.assignedTo?.username ||
                        task?.assignedTo?.fullName ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-600">
                        Assigned To
                      </p>

                      <p className="text-sm font-medium text-slate-300">
                        {task?.assignedTo?.username ||
                          task?.assignedTo?.fullName ||
                          task?.assignedTo?.email ||
                          "User"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="relative mt-5 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
                  <button
                    onClick={() =>
                      navigate(
                        `/projects/${task?.project?._id}/tasks/${task?._id}`
                      )
                    }
                    className="
                      flex-1 rounded-lg
                      bg-lime-500 px-4 py-2.5
                      text-sm font-semibold text-black
                      transition
                      hover:bg-lime-400
                    "
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/projects/${task?.project?._id}/tasks/${task?._id}/edit`
                      )
                    }
                    className="
                      flex-1 rounded-lg
                      border border-slate-700
                      px-4 py-2.5
                      text-sm font-medium text-slate-300
                      transition
                      hover:border-lime-500/30
                      hover:bg-slate-800
                      hover:text-lime-400
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(task?._id)
                    }
                    className="
                      rounded-lg
                      border border-red-500/20
                      px-4 py-2.5
                      text-sm font-medium text-red-400
                      transition
                      hover:bg-red-500/10
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllTasks;