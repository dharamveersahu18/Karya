import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../services/taskApi";
import { getProjectMembers } from "../services/projectApi";
function EditTask() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
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
          status: task.status || "TODO",
          priority: task.priority || "MEDIUM",
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

        console.log("Updating task with:", {
            ...formData,
            projectId,
        });

        await updateTask(taskId, {
            ...formData,
            projectId,
        });

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
      <h1 className="mb-6 text-2xl font-bold">Edit Task</h1>

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
            rows="4"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-lime-400"
          />
        </div>
    
        <div>
          <label className="mb-2 block text-sm text-slate-300">Assign To</label>

          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            disabled={usersLoading}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-lime-400"
          >
            <option value="">
              {usersLoading ? "Loading users..." : "Select a user"}
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
          <label className="mb-2 block text-sm text-slate-300">Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
        {/* Priority */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">Priority</label>

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
          <label className="mb-2 block text-sm text-slate-300">Due Date</label>

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
            onClick={() => navigate(`/projects/${projectId}/tasks`)}
            className="rounded-lg border border-slate-700 px-5 py-3 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-lime-500 px-5 py-3 font-medium text-black hover:bg-lime-400 disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTask;
