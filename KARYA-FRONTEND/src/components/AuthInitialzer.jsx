import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getCurrentUser } from "../services/authApi";
import { setUser, logout } from "../redux/authSlice"
function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getCurrentUser();

        console.log("Current user:", response);

        dispatch(setUser(response.data));
      } catch (error) {
        console.log("No authenticated user");

        dispatch(logout());
      }
    };

    checkUser();
  }, [dispatch]);

  return children;
}

export default AuthInitializer;
