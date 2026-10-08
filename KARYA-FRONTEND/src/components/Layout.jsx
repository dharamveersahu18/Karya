
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
  <div className="flex min-h-screen bg-[#090b0f] text-white">
    {/* Sidebar */}
    <aside
      className="
        hidden w-64 shrink-0
        border-r border-slate-800/80
        bg-slate-950
        md:flex md:flex-col
      "
    >
      {/* Logo / Brand */}
      <div className="border-b border-slate-800/80 px-5 py-6">
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-lime-500
              text-lg font-black
              text-black
              shadow-lg shadow-lime-500/10
            "
          >
            K
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Karya
            </h1>

            <p className="text-[11px] text-slate-500">
              Work Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-5">
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className="
            group flex items-center gap-3
            rounded-xl
            px-4 py-3
            text-sm font-medium
            text-slate-400
            transition-all duration-200
            hover:bg-slate-900
            hover:text-white
          "
        >
          <LayoutDashboard
            size={19}
            className="transition-colors group-hover:text-lime-400"
          />

          <span>Dashboard</span>
        </Link>

        {/* Projects */}
        <Link
          to="/projects"
          className="
            group flex items-center gap-3
            rounded-xl
            px-4 py-3
            text-sm font-medium
            text-slate-400
            transition-all duration-200
            hover:bg-slate-900
            hover:text-white
          "
        >
          <FolderKanban
            size={19}
            className="transition-colors group-hover:text-lime-400"
          />

          <span>Projects</span>
        </Link>

        {/* Notifications */}
        <Link
          to="/notifications"
          className="
            group flex items-center justify-between
            rounded-xl
            px-4 py-3
            text-sm font-medium
            text-slate-400
            transition-all duration-200
            hover:bg-slate-900
            hover:text-white
          "
        >
          <div className="flex items-center gap-3">
            <Bell
              size={19}
              className="transition-colors group-hover:text-lime-400"
            />

            <span>Notifications</span>
          </div>

          {unreadCount > 0 && (
            <span
              className="
                flex min-w-5 items-center justify-center
                rounded-full
                bg-lime-500
                px-1.5 py-0.5
                text-[10px]
                font-bold
                text-black
              "
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          className="
            group flex items-center gap-3
            rounded-xl
            px-4 py-3
            text-sm font-medium
            text-slate-400
            transition-all duration-200
            hover:bg-slate-900
            hover:text-white
          "
        >
          <User
            size={19}
            className="transition-colors group-hover:text-lime-400"
          />

          <span>Profile</span>
        </Link>
      </nav>

      {/* Bottom Workspace */}
      <div className="border-t border-slate-800/80 p-4">
        <div
          className="
            rounded-xl
            border border-slate-800
            bg-slate-900/60
            p-3
          "
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
            Workspace
          </p>

          <p className="mt-1 text-sm font-medium text-slate-300">
            My Workspace
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Manage your work
          </p>
        </div>
      </div>
    </aside>

    {/* Main Area */}
    <div className="min-w-0 flex-1">
      {/* Navbar */}
      <header
        className="
          sticky top-0 z-20
          flex items-center justify-between
          border-b border-slate-800/80
          bg-[#090b0f]/90
          px-4 py-4
          backdrop-blur-xl
          sm:px-6
          lg:px-8
        "
      >
        {/* Mobile Logo */}
        <div className="flex items-center gap-3 md:hidden">
          <div
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              bg-lime-500
              text-sm font-black
              text-black
            "
          >
            K
          </div>

          <h2 className="text-lg font-bold">
            Karya
          </h2>
        </div>

        {/* Desktop title */}
        <div className="hidden md:block">
          <p className="text-xs text-slate-600">
            Workspace
          </p>

          <h2 className="text-sm font-semibold text-slate-300">
            Karya
          </h2>
        </div>

        {/* Notification */}
        <Link
          to="/notifications"
          className="
            relative flex h-9 w-9
            items-center justify-center
            rounded-lg
            border border-slate-800
            bg-slate-900
            text-slate-400
            transition
            hover:border-lime-500/30
            hover:text-lime-400
          "
        >
          <Bell size={17} />

          {unreadCount > 0 && (
            <span
              className="
                absolute -right-1 -top-1
                h-2.5 w-2.5
                rounded-full
                bg-lime-500
                ring-2 ring-[#090b0f]
              "
            />
          )}
        </Link>
      </header>

      {/* Page Content */}
      <main
        className="
          min-h-[calc(100vh-73px)]
          p-4
          sm:p-6
          lg:p-8
        "
      >
        <Outlet />
      </main>
    </div>
  </div>
);
}

export default MainLayout;

