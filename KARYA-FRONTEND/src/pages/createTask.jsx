import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask } from "../services/taskApi";
import { getProjectMembers } from "../services/projectApi";

function CreateTask() {
  const { projectId } = useParams();
  const navigate = useNavigate();

 const [users, setUsers] = useState([]);
const [usersLoading, setUsersLoading] = useState(true);
const [formData, setFormData] = useState({
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  assignedTo: "",
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [assignedTo, setAssignedTo] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const taskData = {
        ...formData,
        projectId,
      };

      const response = await createTask(taskData);

      console.log("Task created:", response);

      navigate(`/projects/${projectId}/tasks`);
    } catch (error) {
      console.error("Create task error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create task"
      );
    } finally {
      setLoading(false);
    }
  };
  // membes
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


return (
  <div className="mx-auto max-w-2xl">
    {/* Header */}
    <div className="mb-8">
      <p className="text-sm font-medium text-lime-400">
        Task Management
      </p>

      <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
        Create Task
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Add a new task and assign it to a project member.
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
        p-6
        shadow-xl shadow-black/10
        sm:p-7
      "
    >
      {/* Glow */}
      <div
        className="
          pointer-events-none absolute
          -right-20 -top-20
          h-40 w-40
          rounded-full
          bg-lime-500/5
          blur-3xl
        "
      />

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
            placeholder="Enter task title"
            required
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
            placeholder="Describe what needs to be done..."
            rows="5"
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

        {/* Assign To */}
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
              {usersLoading
                ? "Loading users..."
                : "Select a user"}
            </option>

            {users.map((user) => (
              <option
                key={user?._id}
                value={user?._id}
              >
                {user?.fullName} (@{user?.username})
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-slate-600">
            Assign this task to a project member.
          </p>
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

        {/* Buttons */}
        <div className="border-t border-slate-800 pt-5">
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
              disabled={loading}
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
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
);
}

export default CreateTask;