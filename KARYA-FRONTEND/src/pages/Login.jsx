import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loginUser } from "../services/authApi";
import { loginStart, loginSuccess, loginFailure } from "../redux/authSlice";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(loginStart());

    try {
      const response = await loginUser(formData);

      console.log("Login successful:", response);

      dispatch(loginSuccess(response.data));

      navigate("/dashboard");
    } catch (error) {
      console.log("Login error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Login failed";

      dispatch(loginFailure(message));
    }
  };

 return (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090b0f] px-4 py-10 text-white">
    {/* Background glow */}
    <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-lime-500/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-lime-500/5 blur-3xl" />

    {/* Login Card */}
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
        {/* Brand + Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400 text-xl font-bold text-black shadow-lg shadow-lime-500/10">
            K
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Login to your Karya account
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
              <label className="text-sm font-medium text-slate-300">
                Password
              </label>

              <button
                type="button"
                className="text-xs text-slate-600 transition hover:text-lime-400"
              >
                Forgot password?
              </button>
            </div>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
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

          {/* Login */}
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-600">OR</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* Register */}
        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="
              font-medium text-lime-400
              transition hover:text-lime-300
            "
          >
            Create account
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

export default Login;
