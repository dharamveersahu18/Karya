import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authApi";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
function Profile() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await getCurrentUser();

      console.log("Profile response:", response);

      setUser(response.data);
    } catch (error) {
      console.error("Profile error:", error);
      setError(error.response?.data?.message || "Failed to load Profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setAvatar(file);
    setMessage("");
    setError("");
  };

  const handleUploadAvatar = async () => {
    if (!avatar) {
      setError("Please select an image first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("avatar", avatar);

      const response = await api.post("/users/avatar", formData);

      console.log("Avatar upload response:", response);

      setUser(response.data?.data || response.data);

      setMessage("Avatar updated successfully.");
      setAvatar(null);
    } catch (error) {
      console.error("Avatar upload error:", error);

      setError(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

if (error && !user) {
  return (
    <ErrorMessage
      message={error}
      onRetry={fetchProfile}
    />
  );
}

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>

        <p className="mt-2 text-slate-400">Manage your TaskForge profile.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="h-28 w-28 rounded-full object-cover border-4 border-lime-500 shadow-lg"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-lime-500 text-3xl font-bold text-black">
              {user?.fullName?.charAt(0)?.toUpperCase() ||
                user?.username?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>
          )}

          <label className="mt-5 cursor-pointer rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
            Choose Avatar
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>

          {avatar && (
            <p className="mt-2 text-sm text-slate-500">
              Selected: {avatar.name}
            </p>
          )}

<button
  onClick={handleUploadAvatar}
  disabled={!avatar || uploading}
  className="rounded-lg bg-lime-500 px-5 py-2.5 font-medium text-black transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-50"
>
  {uploading ? "Uploading..." : "Upload Avatar"}
</button>
        </div>

        {/* Messages */}
      {message && (
  <p className="text-sm text-green-400">
    {message}
  </p>
)}

 {error && (
  <p className="text-sm text-red-400">
    {error}
  </p>
)}


        {/* User information */}
       <div className="space-y-4">
  <div>
    <p className="text-sm text-slate-500">Full Name</p>
    <p className="mt-1 text-white">
      {user?.fullName || "Not provided"}
    </p>
  </div>

  <div>
    <p className="text-sm text-slate-500">Username</p>
    <p className="mt-1 text-white">
      {user?.username || "Not provided"}
    </p>
  </div>

  <div>
    <p className="text-sm text-slate-500">Email</p>
    <p className="mt-1 text-white">
      {user?.email || "Not provided"}
    </p>
  </div>
</div>
      </div>
    </div>
  );
}

export default Profile;
