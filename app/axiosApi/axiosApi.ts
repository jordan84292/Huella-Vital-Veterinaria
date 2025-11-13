import axios from "axios";
export const axiosApi = axios.create({
  baseURL:
    "https://api-huella-vital-mxpk9qt0j-gonzalezjordan61-8380s-projects.vercel.app/api/v1",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
