import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardApi";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();

        console.log("Dashboard response:", response);

        setDashboard(response.data);
      } catch (error) {
        console.log("Dashboard error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Welcome back to TaskForge.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Projects
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {dashboard?.totalProjects ?? 0}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Tasks
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {dashboard?.totalTasks ?? 0}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Completed
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {dashboard?.completedTasks ?? 0}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Pending
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {dashboard?.pendingTasks ?? 0}
          </h2>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;