import api from "../../../config/api";

export const registerApi = async (data) => {
  const res = await api.post("auth/register", data);
  console.log(res.data);
  return res.data;
};

export const loginApi = async (data) => {
  const res = await api.post("auth/login", data);
  console.log(res.data);
  return res.data;
};

export const getUserApi = async () => {
  const res = await api.get("auth/me");
  return res.data;
};

export const logOutApi = async () => {
  const res = await api.post("auth/logout");
  return res.data;
};
