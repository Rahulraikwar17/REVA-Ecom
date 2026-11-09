import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { getUserApi, loginApi, logOutApi, registerApi } from "../api/auth.api";
import { logOut, setCredentials } from "../state/AuthSlice";
import { toast } from "react-toastify";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (response) => {
      const { accessToken, user } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      dispatch(setCredentials({ user, accessToken }));
      queryClient.setQueryData(["currentUser"], response.data);

      toast.success("Account created successfully");
      navigate("/home");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Registration failed");
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const responseData = data?.data ?? data;

      const accessToken = responseData?.accessToken;
      const user = responseData?.user;

      if (!accessToken || !user) {
        console.error("Unexpected login response:", data);
        toast.error("Invalid login response from server.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);

      dispatch(setCredentials({ user, accessToken }));

      toast.success("Login successful!");

      navigate("/home");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Invalid email or password",
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logOutApi,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      dispatch(logOut());
      queryClient.clear();

      toast.success("Logged out successfully");
      navigate("/home");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Logout failed");
    },
  });

  return {
    registerUser: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    loginUser: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    logOutUser: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    logOutError: logoutMutation.error,
  };
};

export const useCurrentUser = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: getUserApi,
    enabled: Boolean(token),
    retry: (count, error) => {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        return false;
      }

      return count < 2;
    },
  });

  useEffect(() => {
    if (query.data?.data?.user) {
      dispatch(
        setCredentials({
          user: query.data.data.user,
          accessToken: token,
        }),
      );
    }
  }, [query.data, dispatch, token]);

  useEffect(() => {
    const status = query.error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("accessToken");
      dispatch(logOut());
    }
  }, [query.error, dispatch]);

  return {
    currentUser: query.data?.data?.user ?? null,
    fetchingUser: Boolean(token) && query.isLoading,
    currentUserError: query.error,
  };
};

export default useAuth;
