import axios from "axios";
export const axiosApi = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
