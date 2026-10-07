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
  <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

    {/* ================= HEADER ================= */}
    <div className="mb-8">
      <p className="mb-2 text-sm font-medium text-lime-400">
        Account Settings
      </p>

      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Profile
      </h1>

      <p className="mt-2 text-sm text-slate-400 sm:text-base">
        Manage your personal information and profile appearance.
      </p>
    </div>

    {/* ================= PROFILE CARD ================= */}
    <div
      className="
        overflow-hidden rounded-2xl
        border border-slate-800
        bg-slate-900
        shadow-xl shadow-black/20
      "
    >

      {/* ================= COVER ================= */}
      <div
        className="
          relative h-36
          overflow-hidden
          bg-gradient-to-r
          from-lime-500/20
          via-slate-900
          to-slate-900
        "
      >
        {/* Decorative glow */}
        <div
          className="
            absolute -right-10 -top-20
            h-52 w-52
            rounded-full
            bg-lime-500/10
            blur-3xl
          "
        />

        <div
          className="
            absolute -left-10 -bottom-20
            h-40 w-40
            rounded-full
            bg-lime-500/5
            blur-3xl
          "
        />

        {/* Small label */}
        <div className="absolute right-5 top-5">
          <span
            className="
              rounded-full
              border border-lime-400/20
              bg-black/20
              px-3 py-1
              text-xs
              font-medium
              text-lime-400
              backdrop-blur-md
            "
          >
            TaskForge Account
          </span>
        </div>
      </div>

      {/* ================= PROFILE CONTENT ================= */}
      <div className="px-6 pb-7 sm:px-8">

        {/* Avatar + Basic Info */}
        <div
          className="
            -mt-14
            flex flex-col
            items-center
            gap-5
            sm:flex-row
            sm:items-end
          "
        >

          {/* Avatar */}
          <div className="relative">

            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="
                  h-28 w-28
                  rounded-full
                  border-4
                  border-slate-900
                  object-cover
                  shadow-xl
                  shadow-black/30
                "
              />
            ) : (
              <div
                className="
                  flex h-28 w-28
                  items-center justify-center
                  rounded-full
                  border-4
                  border-slate-900
                  bg-lime-500
                  text-4xl
                  font-bold
                  text-black
                  shadow-xl
                  shadow-lime-500/10
                "
              >
                {user?.fullName?.charAt(0)?.toUpperCase() ||
                  user?.username?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>
            )}

            {/* Online indicator */}
            <span
              className="
                absolute
                bottom-2
                right-2
                h-5 w-5
                rounded-full
                border-4
                border-slate-900
                bg-green-500
              "
              title="Active"
            />
          </div>

          {/* Name */}
          <div className="flex-1 text-center sm:pb-2 sm:text-left">
            <h2 className="text-2xl font-bold text-white">
              {user?.fullName || "User"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              @{user?.username || "username"}
            </p>
          </div>

          {/* Account badge */}
          <div className="sm:pb-2">
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border border-slate-700
                bg-slate-800
                px-4 py-2
                text-xs
                font-medium
                text-slate-300
              "
            >
              <span className="h-2 w-2 rounded-full bg-lime-400" />
              Active Account
            </span>
          </div>
        </div>

        {/* ================= AVATAR UPLOAD ================= */}
        <div
          className="
            mt-8
            rounded-xl
            border border-dashed
            border-slate-700
            bg-slate-950/40
            p-5
            transition
            hover:border-lime-500/30
          "
        >
          <div
            className="
              flex flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>
              <h3 className="font-semibold text-white">
                Profile Picture
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Upload a JPG, PNG or WebP image for your profile.
              </p>
            </div>

            <label
              className="
                inline-flex
                cursor-pointer
                items-center
                justify-center
                rounded-lg
                border border-slate-700
                bg-slate-800
                px-4 py-2.5
                text-sm
                font-medium
                text-slate-200
                transition
                hover:border-lime-500/40
                hover:bg-slate-700
                hover:text-lime-400
              "
            >
              Choose Image

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Selected file */}
          {avatar && (
            <div
              className="
                mt-4
                flex flex-col
                gap-3
                rounded-lg
                border border-slate-800
                bg-slate-900
                p-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  Selected file
                </p>

                <p className="mt-1 truncate text-sm text-slate-300">
                  {avatar.name}
                </p>
              </div>

              <button
                onClick={handleUploadAvatar}
                disabled={!avatar || uploading}
                className="
                  shrink-0
                  rounded-lg
                  bg-lime-500
                  px-5 py-2.5
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:bg-lime-400
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {uploading ? "Uploading..." : "Upload Avatar"}
              </button>
            </div>
          )}
        </div>

        {/* ================= MESSAGES ================= */}
        {message && (
          <div
            className="
              mt-5
              rounded-lg
              border border-green-500/20
              bg-green-500/10
              px-4 py-3
              text-sm
              text-green-400
            "
          >
            ✓ {message}
          </div>
        )}

        {error && (
          <div
            className="
              mt-5
              rounded-lg
              border border-red-500/20
              bg-red-500/10
              px-4 py-3
              text-sm
              text-red-400
            "
          >
            ⚠ {error}
          </div>
        )}

        {/* ================= ACCOUNT INFORMATION ================= */}
        <div className="mt-8">

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">
              Account Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your basic account details.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            {/* Full Name */}
            <div
              className="
                rounded-xl
                border border-slate-800
                bg-slate-950/40
                p-5
                transition
                hover:border-slate-700
              "
            >
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Full Name
              </p>

              <p className="mt-2 text-base font-medium text-white">
                {user?.fullName || "Not provided"}
              </p>
            </div>

            {/* Username */}
            <div
              className="
                rounded-xl
                border border-slate-800
                bg-slate-950/40
                p-5
                transition
                hover:border-slate-700
              "
            >
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Username
              </p>

              <p className="mt-2 text-base font-medium text-white">
                @{user?.username || "Not provided"}
              </p>
            </div>

            {/* Email */}
            <div
              className="
                rounded-xl
                border border-slate-800
                bg-slate-950/40
                p-5
                transition
                hover:border-slate-700
              "
            >
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Email Address
              </p>

              <p className="mt-2 break-all text-base font-medium text-white">
                {user?.email || "Not provided"}
              </p>
            </div>

            {/* Account Status */}
            <div
              className="
                rounded-xl
                border border-slate-800
                bg-slate-950/40
                p-5
                transition
                hover:border-slate-700
              "
            >
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Account Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                <span className="text-base font-medium text-green-400">
                  Active
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ================= ACCOUNT FOOTER ================= */}
        <div
          className="
            mt-8
            flex flex-col
            gap-2
            border-t border-slate-800
            pt-5
            text-xs
            text-slate-500
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <span>
            TaskForge Workspace
          </span>

          <span>
            Profile & Account
          </span>
        </div>

      </div>
    </div>
  </div>
);

}

export default Profile;
