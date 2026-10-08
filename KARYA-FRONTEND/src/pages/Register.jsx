import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authApi";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await registerUser(formData);

      console.log("Registration successful:", response);

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0] ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090b0f] px-4 py-10 text-white">
    {/* Background glow */}
    <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-lime-500/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-lime-500/5 blur-3xl" />

    {/* Main Card */}
    <div className="relative w-full max-w-md">
      <div
        className="
          rounded-2xl
          border border-slate-800
          bg-slate-900/90
          p-7
          shadow-2xl shadow-black/30
          backdrop-blur-xl
          sm:p-8
        "
      >
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400 font-bold text-xl text-black shadow-lg shadow-lime-500/10">
            K
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Create account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Join Karya and start managing your work.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              mb-5 rounded-xl
              border border-red-500/20
              bg-red-500/10
              px-4 py-3
              text-sm text-red-400
            "
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="
                w-full rounded-xl
                border border-slate-800
                bg-slate-950
                px-4 py-3
                text-sm text-white
                placeholder:text-slate-600
                outline-none
                transition
                focus:border-lime-400/60
                focus:ring-2
                focus:ring-lime-400/10
              "
            />
          </div>

          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              className="
                w-full rounded-xl
                border border-slate-800
                bg-slate-950
                px-4 py-3
                text-sm text-white
                placeholder:text-slate-600
                outline-none
                transition
                focus:border-lime-400/60
                focus:ring-2
                focus:ring-lime-400/10
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="
                w-full rounded-xl
                border border-slate-800
                bg-slate-950
                px-4 py-3
                text-sm text-white
                placeholder:text-slate-600
                outline-none
                transition
                focus:border-lime-400/60
                focus:ring-2
                focus:ring-lime-400/10
              "
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-300">
                Password
              </label>

              <span className="text-xs text-slate-600">
                Keep it secure
              </span>
            </div>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="
                w-full rounded-xl
                border border-slate-800
                bg-slate-950
                px-4 py-3
                text-sm text-white
                placeholder:text-slate-600
                outline-none
                transition
                focus:border-lime-400/60
                focus:ring-2
                focus:ring-lime-400/10
              "
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-xl
              bg-lime-400
              px-4 py-3
              font-semibold
              text-slate-950
              transition-all duration-200
              hover:bg-lime-300
              hover:shadow-lg
              hover:shadow-lime-500/10
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-600">OR</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* Login */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              font-medium text-lime-400
              transition hover:text-lime-300
            "
          >
            Login
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="mt-5 text-center text-xs text-slate-700">
        © {new Date().getFullYear()} Karya. Built for better teamwork.
      </p>
    </div>
  </div>
);
}

export default Register;