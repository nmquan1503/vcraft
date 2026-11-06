import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ——— Request Interceptor: tự động đính kèm JWT ———
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ——— Response Interceptor: tự động refresh token khi hết hạn ———
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest!._retry = true;

      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {
              refreshToken,
            });
            localStorage.setItem("accessToken", data.accessToken);
            originalRequest!.headers!.Authorization = `Bearer ${data.accessToken}`;
            return apiClient(originalRequest!);
          } catch {
            // Refresh cũng lỗi → đăng xuất
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        } else {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
