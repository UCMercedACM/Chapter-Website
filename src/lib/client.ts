import axios from "axios";

// oxlint-disable-next-line import/no-named-as-default-member (This is our prefered way of doing it)
export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  withCredentials: true,
});
