import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { getUserApi, loginApi, logOutApi, registerApi } from "../api/auth.api";
import { logOut, setCredentials } from "../state/AuthSlice";


const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const registerMutate = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      const { accessToken, user } = data.data;

      localStorage.setItem("accessToken", accessToken);
      dispatch(setCredentials({ user, accessToken }));
      navigate("/home");
    },
  });

  const loginMutate = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const { accessToken, user } = data.data;

      localStorage.setItem("accessToken", accessToken);
      dispatch(setCredentials({ user, accessToken }));
      navigate("/home");
    },
  });

  const logOutMutation = useMutation({
    mutationFn: logOutApi,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      dispatch(logOut());
      queryClient.clear(); 
      navigate("/login");
    },
  });

  return {
    registerUser: registerMutate.mutate,
    isRegistering: registerMutate.isPending,
    registerError: registerMutate.error,

    loginUser: loginMutate.mutate,
    isLoggingIn: loginMutate.isPending,
    loginError: loginMutate.error,

    logOutUser: logOutMutation.mutate,
    isLoggingOut: logOutMutation.isPending,
    logOutError: logOutMutation.error,
  };
};


export const useCurrentUser = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: getUserApi,
    enabled: !!token,

    retry: (count, error) => !error?.response && count < 2,
  });

  useEffect(() => {
    if (query.data) {
      const { user } = query.data.data;
      dispatch(
        setCredentials({
          user,
          accessToken: localStorage.getItem("accessToken"),
        }),
      );
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      const status = query.error?.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("accessToken");
        dispatch(logOut());
      }
    }
  }, [query.error, dispatch]);

  return {
    currentUser: query.data?.data?.user,
    fetchingUser: query.isLoading,
    currentUserError: query.error,
  };
};

export default useAuth;