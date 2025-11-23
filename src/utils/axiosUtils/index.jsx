import axios from "axios";
import getCookie from "../customFunctions/GetCookie";
import Cookies from "js-cookie";

/**
 * Axios instance
 * Ensures every request (POST, PUT, DELETE, GET)
 * automatically includes:
 * - Base URL
 * - Accept header
 * - Authorization token
 * - Cookies (withCredentials)
 */
const client = axios.create({
  baseURL: process.env.API_PROD_URL, 
  withCredentials: true, // IMPORTANT: send cookies on every request
  headers: {
    Accept: "application/json",
  },
});

/**
 * Attach Authorization token and cookie before every request
 */
client.interceptors.request.use(
  (config) => {
    // Auth token from cookie (uat)
    const token = getCookie("uat");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Global request handler
 */
const request = async ({ ...options }, router) => {
  const onSuccess = (response) => response;

  const onError = (error) => {
    if (error?.response?.status === 401) {
      // Optional: clear cookies or redirect
      return error;
    }

    return error;
  };

  try {
    const response = await client(options);
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};

export default request;
