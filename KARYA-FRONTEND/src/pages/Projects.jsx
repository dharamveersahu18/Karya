import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectApi";
import { Link } from "react-router-dom";
import { getAllUsers } from "../services/userApi";
function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [users, setUsers] = useState([]);


  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
     members: [],
  });
  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProjects();

      console.log("Projects response:", response);

      setProjects(response.data || []);
    } catch (error) {
      console.error("Projects error:", error);

      setError(error.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };
// fetch user
const fetchUsers = async () => {
  try {
    const response = await getAllUsers();

    console.log("Users response:", response);

    setUsers(response.data || []);
  } catch (error) {
    console.error("Users error:", error);
    setError(
      error.response?.data?.message || "Failed to load users"
    );
  }
};
  //
  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // Handle input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create project
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      if (editingProject) {
        // UPDATE
        const response = await updateProject(editingProject._id, formData);

        console.log("Project updated:", response);

        setProjects((prev) =>
          prev.map((project) =>
            project._id === editingProject._id ? response.data : project,
          ),
        );
      } else {
        // CREATE
        const response = await createProject(formData);

        console.log("Project created:", response);

        setProjects((prev) => [...prev, response.data]);
      }

      // Reset
     setFormData({
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  members: [],
});

      setEditingProject(null);
      setShowForm(false);
    } catch (error) {
      console.error("Project error:", error);

      setError(error.response?.data?.message || "Failed to save project");
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);

    setFormData({
      name: project.name || "",
      description: project.description || "",
      startDate: project.startDate ? project.startDate.slice(0, 10) : "",
      endDate: project.endDate ? project.endDate.slice(0, 10) : "",
     members: project.members?.map((member) =>
      typeof member === "object" ? member._id : member
    ) || [],
    });

    setShowForm(true);
  };
  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await deleteProject(projectId);

      console.log("Project deleted:", response);

      setProjects((prev) =>
        prev.filter((project) => project._id !== projectId),
      );
    } catch (error) {
      console.error("Delete project error:", error);

      setError(error.response?.data?.message || "Failed to delete project");
    }
  };

if (loading) {
  return <LoadingSpinner text="Loading projects..." />;
}

if (error) {
  return (
    <ErrorMessage
      message={error}
      onRetry={fetchProjects}
    />
  );
}

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>

          <p className="mt-2 text-gray-500">
            Manage your projects and their tasks.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-black px-5 py-3 text-white"
        >
          + Create Project
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border p-4 text-red-500">{error}</div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border p-6">
          <h2 className="mb-6 text-xl font-semibold">
            {editingProject ? "Update Project" : "Create New Project"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-2 block">Project Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block">Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description"
                rows="4"
                className="w-full rounded-lg border p-3"
              />
            </div>
{/* Members */}
<div className="rounded-lg p-4 text-cyan-50">
  <label className="mb-3 block font-semibold">
    Project Members
  </label>

  <div className="max-h-52 space-y-2 overflow-y-auto rounded-lg  p-2">
    {users.length > 0 ? (
      users.map((user) => {
        const isSelected = formData.members.includes(user._id);

    return (
      <label
        key={user._id}
        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
          isSelected
            ? "border-cyan-300 bg-cyan-900/50"
            : "border-stone-400 bg-stone-500 hover:bg-stone-400"
        }`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(event) => {
            setFormData((prev) => ({
              ...prev,
              members: event.target.checked
                ? [...prev.members, user._id]
                : prev.members.filter(
                    (id) => id !== user._id
                  ),
            }));
          }}
          className="h-4 w-4"
        />

        <div className="flex-1">
          <p className="font-medium">
            {user.name ||
              user.fullName ||
              user.username ||
              user.email}
          </p>

          {user.email && (
            <p className="text-sm text-cyan-100">
              {user.email}
            </p>
          )}
        </div>
      </label>
    );
  })
) : (
  <p className="p-3 text-sm text-cyan-100">
    No users available
  </p>
)}


  </div>

  <p className="mt-2 text-sm text-cyan-100">
    Select the users you want to add to this project.
  </p>

{formData.members.length > 0 && ( <p className="mt-2 text-sm font-medium text-cyan-200">
{formData.members.length} member
{formData.members.length !== 1 ? "s" : ""} selected </p>
)}

</div>

            {/* Start Date */}
            <div>
              <label className="mb-2 block">Start Date</label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="mb-2 block">End Date</label>

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
        <button
                type="submit"
                
                className="rounded-lg border px-5 py-3"
              >
           CREATE
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border px-5 py-3"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects */}
  {projects.length === 0 ? (
  <EmptyState
    title="No projects yet"
    message="Create your first project to get started."
  />
): (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {projects.map((project) => (

      
  <div
    key={project._id}
    className="rounded-xl border border-slate-800 bg-slate-900 p-5"
  >
    <h2 className="text-xl font-semibold">
      {project.name}
    </h2>

    <p className="mt-2 text-slate-400">
      {project.description}
    </p>

    <div className="mt-4">
      <Link
        to={`/projects/${project._id}/tasks`}
        className="inline-block rounded-lg bg-lime-500 px-4 py-2 text-sm font-medium text-black hover:bg-lime-400"
      >
        View Tasks
      </Link>
      <Link
  to={`/projects/${project._id}/activities`}
  className="inline-block rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
>
  Activity
</Link>
    </div>
      



              {project.startDate && (
                <p className="mt-4 text-sm">
                  Start: {new Date(project.startDate).toLocaleDateString()}
                </p>
              )}

              {project.endDate && (
                <p className="text-sm">
                  End: {new Date(project.endDate).toLocaleDateString()}
                </p>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleEdit(project)}
                  className="rounded-lg border px-4 py-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(project._id)}
                  className="rounded-lg border px-4 py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
