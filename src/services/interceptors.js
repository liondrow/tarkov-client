import axiosInstance from "./api";
import router from "@/router/index.js";

const setup = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = JSON.parse(localStorage.getItem('token'))
            if (token) {
                config.headers["Authorization"] = 'Bearer ' + token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            if(error.response) {
                if(error.response.status === 401) {
                    localStorage.removeItem('token');
                    router.replace({
                        path:'/login'
                    })
                }
                return Promise.reject(error.response.data);
            }
        }
    );
};

export default setup;
