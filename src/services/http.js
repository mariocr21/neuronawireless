import axios from "axios";

const tokenStorageKey = "access_token";

const apiBaseURL = import.meta.env.VITE_NEURONA_API_ENDPOINT || "/api";
const appBaseURL =
  import.meta.env.VITE_NEURONA_APP_ENDPOINT ||
  apiBaseURL.replace(/\/api\/?$/, "/app");

const attachAuth = (config) => {
  const token = localStorage.getItem(tokenStorageKey);

  config.headers = config.headers || {};
  config.headers.Accept = config.headers.Accept || "application/json";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const handleUnauthorized = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem(tokenStorageKey);
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  }

  return Promise.reject(error);
};

const createClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  client.interceptors.request.use(attachAuth);
  client.interceptors.response.use((response) => response, handleUnauthorized);

  return client;
};

export const apiClient = createClient(apiBaseURL);
export const appClient = createClient(appBaseURL);

export const inertiaHeaders = {
  "X-Inertia": true,
  "X-Requested-With": "XMLHttpRequest",
  Accept: "application/json",
};

export const fetchInertiaPage = async (path) => {
  const response = await appClient.get(path, { headers: inertiaHeaders });
  return response.data?.props || {};
};

export const extractErrorMessage = (error, fallback = "Ocurrio un error inesperado.") => {
  const payload = error?.response?.data;

  if (payload?.message) {
    return payload.message;
  }

  const errors = payload?.errors;
  if (Array.isArray(errors?.message) && errors.message.length) {
    return errors.message[0];
  }

  if (errors && typeof errors === "object") {
    const firstError = Object.values(errors)[0];
    if (Array.isArray(firstError) && firstError.length) {
      return firstError[0];
    }
    if (typeof firstError === "string") {
      return firstError;
    }
  }

  return error?.message || fallback;
};

export const authStorageKey = tokenStorageKey;
