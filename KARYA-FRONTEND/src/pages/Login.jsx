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
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back</h1>

          <p className="mt-2 text-slate-400">Login to your TaskForge account</p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-lime-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-lime-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-lime-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-lime-400 hover:text-lime-300"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
