import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../services/notificationApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
function Notifications() {
const [notifications, setNotifications] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications();

      console.log("Notifications response:", response);

      setNotifications(response.data || []);
    } catch (error) {
      console.error("Notifications error:", error);

      setError(error.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Mark notification error:", error);
          setError(
      error.response?.data?.message ||
        "Failed to mark notification as read"
    );
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId),
      );
    } catch (error) {
      console.error("Delete notification error:", error);
        setError(
      error.response?.data?.message ||
        "Failed to delete notification"
    );
    }
  };

if (loading) {
  return <LoadingSpinner text="Loading notifications..." />;
}

if (error) {
  return (
    <ErrorMessage
      message={error}
      onRetry={fetchNotifications}
    />
  );
}

 return (
  <div className="mx-auto max-w-4xl">
    {/* Header */}
    <div className="mb-8">
      <p className="text-sm font-medium text-lime-400">
        Workspace
      </p>

      <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
        Notifications
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Stay updated with your Karya activity.
      </p>
    </div>

    {/* Notifications */}
    {notifications.length === 0 ? (
      <EmptyState
        title="No notifications"
        message="You're all caught up. New notifications will appear here."
      />
    ) : (
      <div className="space-y-3">
        {notifications.map((notification) => {
          const isUnread = !notification?.isRead;

          return (
            <div
              key={notification?._id}
              className={`
                group relative overflow-hidden rounded-2xl
                border p-5
                transition-all duration-300
                hover:-translate-y-0.5
                ${
                  isUnread
                    ? "border-lime-500/30 bg-lime-500/[0.04] hover:border-lime-500/50"
                    : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
                }
              `}
            >
              {/* Unread glow */}
              {isUnread && (
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-lime-500/10 blur-3xl" />
              )}

              <div className="relative flex gap-4">
                {/* Notification Icon */}
                <div
                  className={`
                    flex h-11 w-11 shrink-0 items-center justify-center
                    rounded-xl border
                    ${
                      isUnread
                        ? "border-lime-500/20 bg-lime-500/10 text-lime-400"
                        : "border-slate-800 bg-slate-950 text-slate-500"
                    }
                  `}
                >
                  🔔
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-white">
                          {notification?.type?.replaceAll("_", " ")}
                        </h2>

                        {isUnread && (
                          <span className="rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {notification?.message}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  {notification?.createdAt && (
                    <p className="mt-3 text-xs text-slate-600">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {isUnread && (
                      <button
                        onClick={() =>
                          handleMarkAsRead(notification?._id)
                        }
                        className="
                          rounded-lg
                          border border-lime-500/20
                          px-3 py-2
                          text-xs font-medium
                          text-lime-400
                          transition
                          hover:bg-lime-500/10
                        "
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDelete(notification?._id)
                      }
                      className="
                        rounded-lg
                        border border-red-500/10
                        px-3 py-2
                        text-xs font-medium
                        text-red-400
                        transition
                        hover:border-red-500/20
                        hover:bg-red-500/10
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
}

export default Notifications;
