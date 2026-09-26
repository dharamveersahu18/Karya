import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, FolderKanban, ListTodo, Bell, User } from "lucide-react";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-800 bg-slate-900 p-5">
        
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

          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/projects"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <FolderKanban size={20} />
            Projects
          </Link>

          <Link
            to="/tasks"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <ListTodo size={20} />
            Tasks
          </Link>

          <Link
            to="/notifications"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Bell size={20} />
            Notifications
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <User size={20} />
            Profile
          </Link>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        
        {/* Navbar */}
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 px-8 py-5 backdrop-blur">
          <h2 className="text-xl font-semibold">
            TaskForge
          </h2>
        </header>

        {/* Page */}
        <section className="p-8">
          <Outlet />
        </section>

      </main>
    </div>
  );
}

export default MainLayout;