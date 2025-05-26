import axios from "axios";
import { cookie } from "../lib/cookies";
import { AxiosAdapter, CreateHttpClientAdapter } from "../lib/http-adapter";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.request.use((request) => {
  const token = cookie.getCookie("access_token")?.value || "";
  request.headers.Authorization = `Bearer ${token}`;

  return request;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response;

    if (
      ["unauthorized", "invalid token"].includes(data?.error?.toLowerCase()) &&
      status === 401
    ) {
      cookie.deleteCookie("access_token");
      if (!["/", "/sign-up"].includes(window.location.pathname)) {
        window.location.href = "/";
      }
      return;
    }

    return Promise.reject(error);
  }
);

const axiosAdapter = AxiosAdapter(API);
const httpClient = CreateHttpClientAdapter(axiosAdapter);

export { httpClient };
