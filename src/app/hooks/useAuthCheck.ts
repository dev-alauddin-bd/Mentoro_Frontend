import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../../redux/features/auth/authSlice";

// This hook runs once on the client to verify the user's session.
export const useAuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-session`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Session verification failed");
        const data = await res.json();
        // Expected shape: { user, accessToken }
        if (data?.user && data?.accessToken) {
          dispatch(setUser({ user: data.user, token: data.accessToken }));
        } else {
          dispatch(logout());
        }
      } catch (_) {
        dispatch(logout());
      }
    };

    verify();
  }, [dispatch]);
};
