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
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-lime-500" />
          <p className="text-sm text-slate-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default AuthInitializer;