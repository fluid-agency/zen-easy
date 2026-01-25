import axios from "axios";

export const serverBaseUrl = axios.create({
    baseURL:"http://localhost:4000/api/v1",
    // baseURL:"https://zen-easy-bd-backend.vercel.app/api/v1",
    withCredentials:true,
}) 