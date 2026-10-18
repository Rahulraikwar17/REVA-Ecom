import axios from "axios";

const BASE_URL = "[https://reva-ecom.onrender.com/api](https://reva-ecom.onrender.com/api)";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const SKIP_REFRESH_URLS = ["/auth/login", "/auth/register", "/auth/refresh"];

let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((response) => {
        const accessToken = response.data?.data?.accessToken;

        if (!accessToken) {
          throw new Error("Access token is missing from the refresh response.");
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

const forceLogout = () => {
  localStorage.removeItem("accessToken");

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response.status === 401;

    const requestUrl = originalRequest.url || "";

    const shouldSkipRefresh = SKIP_REFRESH_URLS.some((url) =>
      requestUrl.includes(url),
    );

    if (!isUnauthorized || originalRequest._retry || shouldSkipRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    let newAccessToken;

    try {
      newAccessToken = await refreshAccessToken();
    } catch (refreshError) {
      const status = refreshError.response?.status;

      if (status === 401 || status === 403) {
        forceLogout();
      }

      return Promise.reject(refreshError);
    }

    originalRequest.headers = originalRequest.headers || {};
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    return api(originalRequest);
  },
);

export default api;
