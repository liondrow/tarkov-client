import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API
const token = localStorage.getItem('token')
export const API = axios.create({
    baseURL: baseUrl,
    headers: {
        Authorization: 'Bearer ' + (token ?? '')
    }
})
