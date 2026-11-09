import axios from "axios";

const BASE_URL = "https://reva-ecom.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const SKIP_REFRESH_URLS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
];

let refreshPromise = null;

const isAuthRequest = (url = "") =>
  SKIP_REFRESH_URLS.some((endpoint) => url.includes(endpoint));

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        const accessToken = response.data?.data?.accessToken;

        if (!accessToken) {
          throw new Error("Access token is missing from refresh response.");
        }

        localStorage.setItem("accessToken", accessToken);

        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const clearAccessToken = () => {
  localStorage.removeItem("accessToken");
};

api.interceptors.request.use(
  (config) => {
    if (isAuthRequest(config.url)) {
      return config;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response.status === 401;

    if (
      !isUnauthorized ||
      originalRequest._retry ||
      isAuthRequest(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();

      return Promise.reject(error);
    }
  }
);

export default api;