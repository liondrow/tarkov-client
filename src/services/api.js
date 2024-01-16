import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API
const token = JSON.parse(localStorage.getItem('token'))
const API = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + token
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
    (res) => {
        return res;
    },
    async(err) => {
        const originalConfig = err.config;
        console.log(originalConfig)
        if (originalConfig.url !== "/login_check" && err.response) {
            if (err.response.status === 401) {
                localStorage.removeItem('token');
            }
        }
        return Promise.reject(err)
    }
)

export default API;
