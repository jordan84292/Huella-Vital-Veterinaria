import axios from "axios";
export const axiosApi = axios.create({
  baseURL: "https://vercel.jgonzproductions.com/api/v1",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
