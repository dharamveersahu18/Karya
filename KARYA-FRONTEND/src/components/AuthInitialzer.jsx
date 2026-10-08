import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../services/authApi";
import { setUser, logout } from "../redux/authSlice";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getCurrentUser();

        console.log("Current user:", response);

        dispatch(setUser(response.data));
      } catch (error) {
        console.log("No authenticated user");

        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090b0f] text-white">
        {/* Background glow */}
        <div
          className="
            pointer-events-none absolute
            left-1/2 top-1/2
            h-72 w-72
            -translate-x-1/2 -translate-y-1/2
            rounded-full
            bg-lime-500/5
            blur-3xl
          "
        />

        {/* Loader */}
        <div className="relative flex flex-col items-center">
          {/* Logo */}
          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-lime-500
              text-2xl font-black
              text-black
              shadow-xl
              shadow-lime-500/10
            "
          >
            K
          </div>

          {/* Brand */}
          <h1 className="mt-5 text-xl font-bold tracking-tight">
            Karya
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Work Management
          </p>

          {/* Spinner */}
          <div
            className="
              mt-7 h-7 w-7
              animate-spin
              rounded-full
              border-2
              border-slate-800
              border-t-lime-400
            "
          />

          <p className="mt-4 text-xs text-slate-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default AuthInitializer;