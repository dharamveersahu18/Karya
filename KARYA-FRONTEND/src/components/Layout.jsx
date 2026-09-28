import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  User,
} from "lucide-react";

import { getNotifications } from "../services/notificationApi";

function MainLayout() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await getNotifications();

        console.log("Notifications response:", response);

        const notifications = response?.data || [];

        const unread = notifications.filter(
          (notification) => !notification?.isRead
        );

        setUnreadCount(unread.length);
      } catch (error) {
        console.error(
          "Unread notifications error:",
          error
        );
      }
    };

    fetchUnreadNotifications();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-900 p-5 md:block">

        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-lime-400">
            TaskForge
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Work Management
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          {/* Projects */}
          <Link
            to="/projects"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <FolderKanban size={20} />
            <span>Projects</span>
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="flex items-center justify-between rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <div className="flex items-center gap-3">
              <Bell size={20} />
              <span>Notifications</span>
            </div>

            {unreadCount > 0 && (
              <span className="rounded-full bg-lime-500 px-2 py-0.5 text-xs font-bold text-black">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <User size={20} />
            <span>Profile</span>
          </Link>

        </nav>
      </aside>

      {/* Main Area */}
      <div className="min-w-0 flex-1">

        {/* Navbar */}
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold">
            TaskForge
          </h2>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default MainLayout;

