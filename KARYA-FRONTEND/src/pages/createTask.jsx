import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask } from "../services/taskApi";
import { getAllUsers } from "../services/userApi";
function CreateTask() {
  const { projectId } = useParams();
  const navigate = useNavigate();

 const [users, setUsers] = useState([]);
const [usersLoading, setUsersLoading] = useState(true);
const [formData, setFormData] = useState({
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
  assignedTo: "",
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();

      console.log("Users response:", response);

      setUsers(response.data || []);
    } catch (error) {
      console.error("Get users error:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  fetchUsers();
}, []);
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">
        Create Task
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"
      >
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Task Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-lime-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows="4"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-lime-400"
          />
        </div>
// Assign to
<div>
  <label className="mb-2 block text-sm text-slate-300">
    Assign To
  </label>

  <select
    name="assignedTo"
    value={formData.assignedTo}
    onChange={handleChange}
    disabled={usersLoading}
    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-lime-400"
  >
    <option value="">
      {usersLoading
        ? "Loading users..."
        : "Select a user"}
    </option>

    {users.map((user) => (
      <option key={user._id} value={user._id}>
        {user.fullName} (@{user.username})
      </option>
    ))}
  </select>
</div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Priority
          </label>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Due Date
          </label>

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() =>
              navigate(`/projects/${projectId}/tasks`)
            }
            className="rounded-lg border border-slate-700 px-5 py-3 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-lime-500 px-5 py-3 font-medium text-black hover:bg-lime-400 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;