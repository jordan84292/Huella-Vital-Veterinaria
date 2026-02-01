import axios from "axios";
export const axiosApi = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 30000, // Aumentar el tiempo de espera a 30 segundos
  headers: {
    "Content-Type": "application/json",
  },
});
