import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../services/taskApi";
import { getProjectMembers } from "../services/projectApi";

const normalizeStatus = (status) => {
  const value = String(status || "todo").trim().toLowerCase();

  if (value === "in_progress") return "pending";
  if (["todo", "pending", "completed"].includes(value)) return value;

  return "todo";
};

const normalizePriority = (priority) => {
  const value = String(priority || "medium").trim().toLowerCase();

  if (["low", "medium", "high"].includes(value)) return value;

  return "medium";
};

function EditTask() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  // Get existing task
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTaskById(taskId);

        const task = response.data;
        console.log("Task received:", task);
console.log("Assigned To received:", task.assignedTo);
        setFormData({
          title: task.title || "",
          description: task.description || "",
          status: normalizeStatus(task.status),
          priority: normalizePriority(task.priority),
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          assignedTo: task.assignedTo?._id || task.assignedTo || "",
        });
      } catch (error) {
        console.error("Get task error:", error);

        setError(error.response?.data?.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await getProjectMembers(projectId);

      console.log("Project members response:", response);

      setUsers(response.data || []);
    } catch (error) {
      console.error("Get project members error:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  if (projectId) {
    fetchUsers();
  }
}, [projectId]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.assignedTo) {
        setError("Please select a user to assign the task.");
        return;
    }

    try {
        setSaving(true);
        setError("");

        console.log("Updating task with:", formData);

        await updateTask(taskId, formData);

        navigate(`/projects/${projectId}/tasks`);
    } catch (error) {
        console.error("Update task error:", error);

        setError(
            error.response?.data?.message ||
            "Failed to update task"
        );
    } finally {
        setSaving(false);
    }
};

  if (loading) {
    return <div className="p-6">Loading task...</div>;
  }

  return (
  <div className="mx-auto max-w-2xl">
    {/* Header */}
    <div className="mb-8">
      <p className="text-sm font-medium text-lime-400">
        Task Management
      </p>

      <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
        Edit Task
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Update the task details, assignment, status, and priority.
      </p>
    </div>

    {/* Error */}
    {error && (
      <div
        className="
          mb-5 rounded-xl
          border border-red-500/20
          bg-red-500/10
          px-4 py-3
          text-sm text-red-400
        "
      >
        {error}
      </div>
    )}

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="
        relative overflow-hidden
        rounded-2xl
        border border-slate-800
        bg-slate-900/80
        p-6 shadow-xl shadow-black/10
        sm:p-7
      "
    >
      {/* Top glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-lime-500/5 blur-3xl" />

      <div className="relative space-y-6">
        {/* Task Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Task Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter task title"
            className="
              w-full rounded-xl
              border border-slate-800
              bg-slate-950
              px-4 py-3
              text-sm text-white
              placeholder:text-slate-600
              outline-none
              transition
              focus:border-lime-400/60
              focus:ring-2
              focus:ring-lime-400/10
            "
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="Describe what needs to be done..."
            className="
              w-full resize-none rounded-xl
              border border-slate-800
              bg-slate-950
              px-4 py-3
              text-sm text-white
              placeholder:text-slate-600
              outline-none
              transition
              focus:border-lime-400/60
              focus:ring-2
              focus:ring-lime-400/10
            "
          />
        </div>

        {/* Assignment */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Assign To
          </label>

          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            disabled={usersLoading}
            className="
              w-full rounded-xl
              border border-slate-800
              bg-slate-950
              px-4 py-3
              text-sm text-white
              outline-none
              transition
              focus:border-lime-400/60
              focus:ring-2
              focus:ring-lime-400/10
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <option value="">
              {usersLoading ? "Loading users..." : "Select a user"}
            </option>

            {users.map((user) => (
              <option key={user?._id} value={user?._id}>
                {user?.fullName} (@{user?.username})
              </option>
            ))}
          </select>
        </div>

        {/* Status + Priority */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="
                w-full rounded-xl
                border border-slate-800
                bg-slate-950
                px-4 py-3
                text-sm text-white
                outline-none
                transition
                focus:border-lime-400/60
                focus:ring-2
                focus:ring-lime-400/10
              "
            >
              <option value="todo">TODO</option>
              <option value="pending">IN PROGRESS</option>
              <option value="completed">COMPLETED</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="
                w-full rounded-xl
                border border-slate-800
                bg-slate-950
                px-4 py-3
                text-sm text-white
                outline-none
                transition
                focus:border-lime-400/60
                focus:ring-2
                focus:ring-lime-400/10
              "
            >
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Due Date
          </label>

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="
              w-full rounded-xl
              border border-slate-800
              bg-slate-950
              px-4 py-3
              text-sm text-white
              outline-none
              transition
              focus:border-lime-400/60
              focus:ring-2
              focus:ring-lime-400/10
            "
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-5">
          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                navigate(`/projects/${projectId}/tasks`)
              }
              className="
                rounded-xl
                border border-slate-700
                px-5 py-3
                text-sm font-medium
                text-slate-300
                transition
                hover:bg-slate-800
                hover:text-white
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                rounded-xl
                bg-lime-500
                px-5 py-3
                text-sm font-semibold
                text-black
                transition-all
                hover:bg-lime-400
                hover:shadow-lg
                hover:shadow-lime-500/10
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {saving ? "Updating..." : "Update Task"}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
);
}

export default EditTask;
