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
  ArrowUpRight
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
  <div className="space-y-8">

    {/* =====================================================
        HEADER
    ====================================================== */}
    <div
      className="
        relative overflow-hidden
        rounded-2xl
        border border-slate-800
        bg-slate-900
        px-6 py-7
        sm:px-8
      "
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute -right-20 -top-24
          h-64 w-64
          rounded-full
          bg-lime-500/10
          blur-3xl
        "
      />

      <div className="relative">
        <p className="mb-2 text-sm font-medium text-lime-400">
          Workspace Overview
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Welcome back 👋
        </h1>

        <p className="mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
          Here's what's happening across your TaskForge workspace.
        </p>
      </div>
    </div>


    {/* =====================================================
        STATISTICS
    ====================================================== */}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {/* Projects */}
      <Link
        to="/projects"
        className="
          group relative overflow-hidden
          rounded-2xl
          border border-slate-800
          bg-slate-900
          p-5
          transition-all duration-300
          hover:-translate-y-1
          hover:border-lime-500/40
          hover:shadow-xl
          hover:shadow-lime-500/5
        "
      >
        <div
          className="
            absolute -right-8 -top-8
            h-24 w-24
            rounded-full
            bg-lime-500/10
            blur-2xl
            transition
            group-hover:bg-lime-500/20
          "
        />

        <div className="relative">
          <div className="flex items-center justify-between">
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-lime-400/10
                text-lime-400
              "
            >
              <FolderKanban size={20} />
            </div>

            <ArrowUpRight
              size={18}
              className="
                text-slate-600
                transition
                group-hover:text-lime-400
              "
            />
          </div>

          <p className="mt-5 text-sm text-slate-400">
            Total Projects
          </p>

          <h2 className="mt-1 text-3xl font-bold text-white">
            {dashboard?.statistics?.totalProjects ?? 0}
          </h2>

          <p className="mt-2 text-xs text-slate-500">
            Active workspace projects
          </p>
        </div>
      </Link>


      {/* Tasks */}
      <Link
        to="/tasks"
        className="
          group relative overflow-hidden
          rounded-2xl
          border border-slate-800
          bg-slate-900
          p-5
          transition-all duration-300
          hover:-translate-y-1
          hover:border-blue-500/30
          hover:shadow-xl
          hover:shadow-blue-500/5
        "
      >
        <div className="flex items-center justify-between">
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-blue-500/10
              text-blue-400
            "
          >
            <ListTodo size={20} />
          </div>

          <ArrowUpRight
            size={18}
            className="text-slate-600 transition group-hover:text-blue-400"
          />
        </div>

        <p className="mt-5 text-sm text-slate-400">
          Total Tasks
        </p>

        <h2 className="mt-1 text-3xl font-bold text-white">
          {dashboard?.statistics?.totalTasks ?? 0}
        </h2>

        <p className="mt-2 text-xs text-slate-500">
          Tasks across your projects
        </p>
      </Link>


      {/* Completed */}
    <Link
to="/tasks?status=completed"
  className="
    group relative overflow-hidden
    rounded-2xl
    border border-slate-800
    bg-slate-900
    p-5
    transition-all duration-300
    hover:-translate-y-1
    hover:border-emerald-500/40
    hover:shadow-xl
    hover:shadow-emerald-500/5
  "
>
  <div className="flex items-center justify-between">
    <div
      className="
        flex h-10 w-10
        items-center justify-center
        rounded-xl
        bg-emerald-500/10
        text-emerald-400
      "
    >
      <CheckCircle2 size={20} />
    </div>

    <ArrowUpRight
      size={18}
      className="
        text-slate-600
        transition
        group-hover:text-emerald-400
      "
    />
  </div>

  <p className="mt-5 text-sm text-slate-400">
    Completed
  </p>

  <h2 className="mt-1 text-3xl font-bold text-white">
    {dashboard?.statistics?.completedTasks ?? 0}
  </h2>

  <p className="mt-2 text-xs text-slate-500">
    View completed tasks
  </p>
</Link>


      {/* Pending */}
    
<Link to="/tasks?status=pending"
  className="
    group relative overflow-hidden
    rounded-2xl
    border border-slate-800
    bg-slate-900
    p-5
    transition-all duration-300
    hover:-translate-y-1
    hover:border-amber-500/40
    hover:shadow-xl
    hover:shadow-amber-500/5
  "
>
  <div className="flex items-center justify-between">
    <div
      className="
        flex h-10 w-10
        items-center justify-center
        rounded-xl
        bg-amber-500/10
        text-amber-400
      "
    >
      <Clock3 size={20} />
    </div>

    <ArrowUpRight
      size={18}
      className="
        text-slate-600
        transition
        group-hover:text-amber-400
      "
    />
  </div>

  <p className="mt-5 text-sm text-slate-400">
    Pending Tasks
  </p>

  <h2 className="mt-1 text-3xl font-bold text-white">
    {dashboard?.statistics?.pendingTasks ?? 0}
  </h2>

  <p className="mt-2 text-xs text-slate-500">
    View pending tasks
  </p>
</Link>
    </div>


    {/* =====================================================
        ACTIVITY + MY TASKS
    ====================================================== */}
    <div className="grid gap-6 xl:grid-cols-5">

      {/* =================================================
          RECENT ACTIVITY
      ================================================== */}
      <div
        className="
          rounded-2xl
          border border-slate-800
          bg-slate-900
          p-6
          xl:col-span-3
        "
      >
        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-lime-400/10
                text-lime-400
              "
            >
              <ActivityIcon size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest workspace updates
              </p>
            </div>
          </div>

          <Link
            to="/projects"
            className="
              text-xs font-medium
              text-slate-500
              transition
              hover:text-lime-400
            "
          >
            View Projects →
          </Link>
        </div>


        {dashboard?.recentActivities?.length === 0 ? (
          <div
            className="
              flex min-h-[180px]
              items-center
              justify-center
              rounded-xl
              border border-dashed border-slate-800
            "
          >
            <p className="text-sm text-slate-500">
              No recent activity yet.
            </p>
          </div>
        ) : (
          <div className="space-y-1">

            {dashboard?.recentActivities?.map((activity) => (
              <div
                key={activity?._id}
                className="
                  group
                  flex gap-4
                  rounded-xl
                  p-3
                  transition
                  hover:bg-slate-950
                "
              >

                {/* Timeline icon */}
                <div className="relative">

                  <div
                    className="
                      flex h-9 w-9
                      shrink-0
                      items-center justify-center
                      rounded-full
                      border border-slate-700
                      bg-slate-800
                      text-lime-400
                    "
                  >
                    {getActivityIcon(activity?.type)}
                  </div>

                  <div
                    className="
                      absolute left-1/2
                      top-10
                      h-6 w-px
                      -translate-x-1/2
                      bg-slate-800
                      last:hidden
                    "
                  />
                </div>


                <div className="min-w-0 flex-1">

                  <p className="text-sm leading-5 text-slate-200">
                    {activity?.message ||
                      activity?.type ||
                      "Activity"}
                  </p>

                  {activity?.task && (
                    <p className="mt-1 text-xs text-slate-500">
                      Task:{" "}
                      <span className="text-slate-400">
                        {activity.task.title}
                      </span>
                    </p>
                  )}

                  <p className="mt-1 text-[11px] text-slate-600">
                    {activity?.createdAt
                      ? new Date(
                          activity.createdAt
                        ).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* =================================================
          MY TASKS
      ================================================== */}
      <div
        className="
          rounded-2xl
          border border-slate-800
          bg-slate-900
          p-6
          xl:col-span-2
        "
      >

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="font-semibold text-white">
              My Recent Tasks
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Recently assigned to you
            </p>
          </div>

          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-lime-400/10
              text-lime-400
            "
          >
            <ListTodo size={20} />
          </div>
        </div>


        {dashboard?.myTasks?.length === 0 ? (
          <div
            className="
              flex min-h-[180px]
              items-center
              justify-center
              rounded-xl
              border border-dashed border-slate-800
            "
          >
            <div className="text-center">
              <ListTodo
                size={28}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-500">
                No tasks assigned to you.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">

            {dashboard?.myTasks?.map((task) => (

              <Link
                to={`/projects/${
                  task?.project?._id || task?.project
                }/tasks/${task?._id}`}
                key={task?._id}
                className="
                  group block
                  rounded-xl
                  border border-slate-800
                  bg-slate-950
                  p-4
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-lime-500/30
                  hover:bg-slate-950/80
                "
              >

                <div className="flex items-start justify-between gap-3">

                  <h3
                    className="
                      line-clamp-1
                      text-sm
                      font-medium
                      text-slate-200
                      transition
                      group-hover:text-lime-400
                    "
                  >
                    {task?.title}
                  </h3>

                  <span
                    className={`
                      shrink-0
                      rounded-full
                      px-2.5 py-1
                      text-[10px]
                      font-medium
                      ${
                        task?.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : task?.status === "IN_PROGRESS"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-amber-500/10 text-amber-400"
                      }
                    `}
                  >
                    {task?.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">

                  <span className="text-xs text-slate-500">
                    Priority
                  </span>

                  <span
                    className={`
                      text-xs font-medium
                      ${
                        task?.priority === "HIGH"
                          ? "text-red-400"
                          : task?.priority === "MEDIUM"
                          ? "text-amber-400"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {task?.priority || "N/A"}
                  </span>
                </div>

                {task?.dueDate && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      Due date
                    </span>

                    <span className="text-xs text-slate-500">
                      {new Date(
                        task.dueDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}

              </Link>
            ))}
          </div>
        )}
      </div>
    </div>


    {/* =====================================================
        RECENT PROJECTS
    ====================================================== */}
    <div
      className="
        rounded-2xl
        border border-slate-800
        bg-slate-900
        p-6
        sm:p-7
      "
    >

      <div className="mb-6 flex items-center justify-between">

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-lime-400">
            Workspace
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Projects you recently created or joined
          </p>
        </div>

        <Link
          to="/projects"
          className="
            hidden
            rounded-lg
            border border-slate-700
            px-3 py-2
            text-xs
            font-medium
            text-slate-400
            transition
            hover:border-lime-500/30
            hover:text-lime-400
            sm:block
          "
        >
          View All
        </Link>
      </div>


      {dashboard?.recentProjects?.length === 0 ? (

        <div
          className="
            flex min-h-[180px]
            flex-col
            items-center
            justify-center
            rounded-xl
            border border-dashed border-slate-800
            text-center
          "
        >
          <FolderKanban
            size={32}
            className="mb-3 text-slate-700"
          />

          <p className="text-sm text-slate-500">
            No projects found.
          </p>

          <Link
            to="/projects"
            className="
              mt-3
              text-xs
              font-medium
              text-lime-400
              hover:text-lime-300
            "
          >
            Create your first project →
          </Link>
        </div>

      ) : (

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {dashboard?.recentProjects?.map((project) => (

            <Link
              key={project?._id}
              to={`/projects/${project?._id}/tasks`}
              className="
                group
                relative
                overflow-hidden
                rounded-xl
                border border-slate-800
                bg-slate-950
                p-5
                transition-all duration-300
                hover:-translate-y-1
                hover:border-lime-500/30
                hover:shadow-lg
                hover:shadow-lime-500/5
              "
            >

              {/* Project glow */}
              <div
                className="
                  absolute -right-10 -top-10
                  h-24 w-24
                  rounded-full
                  bg-lime-500/5
                  blur-2xl
                  transition
                  group-hover:bg-lime-500/10
                "
              />

              <div className="relative">

                <div className="flex items-start justify-between gap-3">

                  <div
                    className="
                      flex h-10 w-10
                      items-center justify-center
                      rounded-xl
                      bg-lime-400/10
                      text-lime-400
                    "
                  >
                    <FolderKanban size={19} />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="
                      text-slate-700
                      transition
                      group-hover:text-lime-400
                    "
                  />
                </div>


                <h3
                  className="
                    mt-5
                    line-clamp-1
                    font-semibold
                    text-white
                    transition
                    group-hover:text-lime-400
                  "
                >
                  {project?.name}
                </h3>


                <p
                  className="
                    mt-2
                    line-clamp-2
                    min-h-[40px]
                    text-sm
                    leading-5
                    text-slate-500
                  "
                >
                  {project?.description || "No description"}
                </p>


                <div
                  className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    border-t
                    border-slate-800
                    pt-4
                  "
                >
                  <span className="text-[11px] text-slate-600">
                    Created
                  </span>

                  <span className="text-xs text-slate-500">
                    {project?.createdAt
                      ? new Date(
                          project.createdAt
                        ).toLocaleDateString()
                      : ""}
                  </span>
                </div>

              </div>
            </Link>
          ))}

        </div>
      )}
    </div>
  </div>
);  
}
export default Dashboard;
