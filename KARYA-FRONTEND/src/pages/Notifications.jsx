import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../services/notificationApi";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();

        console.log("Notifications response:", response);

        setNotifications(response.data || []);
      } catch (error) {
        console.error("Notifications error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load notifications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark notification error:", error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Notifications
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Stay updated with your TaskForge activity.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`rounded-xl border p-5 ${
                notification.isRead
                  ? "border-slate-800 bg-slate-900"
                  : "border-lime-500/30 bg-lime-500/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    {notification.type}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {notification.message}
                  </p>
                </div>

                {!notification.isRead && (
                  <span className="rounded-full bg-lime-500 px-2 py-1 text-xs font-medium text-black">
                    New
                  </span>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                {!notification.isRead && (
                  <button
                    onClick={() =>
                      handleMarkAsRead(notification._id)
                    }
                    className="rounded-lg border border-lime-500/30 px-3 py-2 text-sm text-lime-400 hover:bg-lime-500/10"
                  >
                    Mark as read
                  </button>
                )}

                <button
                  onClick={() =>
                    handleDelete(notification._id)
                  }
                  className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
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

export default Notifications;