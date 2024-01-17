import axios from "axios";
import router from "@/router/index.js";

const baseUrl = import.meta.env.VITE_BASE_API
const token = JSON.parse(localStorage.getItem('token'))
const API = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    }
})
API.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers["Authorization"] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
API.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if(error.response) {
            switch(error.response.status) {
                case 401:
                localStorage.removeItem('token');
                router.replace({
                    path:'/login'
                })
            }
            return Promise.reject(error.response.data);
        }
    }

)
export default API;
