import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectTasks,deleteTask } from "../services/taskApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
function Tasks() {
  const { projectId } = useParams();
 const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const fetchTasks = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await getProjectTasks(projectId);

    console.log("Tasks response:", response);

    setTasks(response.data || []);
  } catch (error) {
    console.error("Tasks error:", error);

    setError(
      error.response?.data?.message ||
        "Failed to load tasks"
    );
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return <LoadingSpinner text="Loading tasks..." />;
}

if (error) {
  return (
    <ErrorMessage
      message={error}
      onRetry={fetchTasks}
    />
  );
}
const handleDelete = async (taskId) => {
  try {
    await deleteTask(taskId);

    setTasks((prevTasks) =>
      prevTasks.filter((task) => task._id !== taskId)
    );
  } catch (error) {
    console.error("Delete task error:", error);

    setError(
      error.response?.data?.message ||
        "Failed to delete task"
    );
  }
};
  return (
    <div className="p-6">
<div className="mb-6 flex items-center justify-between">
  <h1 className="text-2xl font-bold">
    Project Tasks
  </h1>

  <button
    onClick={() => navigate(`/projects/${projectId}/tasks/create`)}
    className="rounded-lg bg-lime-500 px-4 py-2 font-medium text-black hover:bg-lime-400"
  >
    + Create Task
  </button>
</div>

      {tasks.length === 0 ? (
  <EmptyState
    title="No tasks yet"
    message="Create a task for this project to get started."
  />
) : (
  <div className="space-y-4">
    {tasks.map((task) => (
    <div
      key={task._id}
      className="rounded-lg border border-slate-800 bg-slate-900 p-4"
    >
      <h2 className="text-lg font-semibold">
        {task.title}
      </h2>

      <p className="mt-1 text-gray-400">
        {task.description}
      </p>

      <div className="mt-3 flex gap-4 text-sm text-gray-400">
        <span>
          Status: {task.status}
        </span>

        <span>
          Priority: {task.priority}
        </span>

        <span>
          Due:{" "}
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>

      <button
        onClick={() => handleDelete(task._id)}
        className="mt-4 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
      >
        Delete
      </button>

      <button
  onClick={() =>
    navigate(
      `/projects/${projectId}/tasks/${task._id}/edit`
    )
  }
  className="mt-4 mr-3 rounded-lg border border-lime-500/30 px-3 py-2 text-sm text-lime-400 hover:bg-lime-500/10"
>
  Edit
</button>
<button
  onClick={() =>
    navigate(
      `/projects/${projectId}/tasks/${task._id}`
    )
  }
  className="mt-4 mr-3 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
>
  View
</button>
    </div>
  ))}
</div>
      )}
    </div>
  );
}

export default Tasks;