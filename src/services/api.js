import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API
const instance = axios.create({
        baseURL: baseUrl,
        headers: {
            "Content-Type": "application/json",
        }
});

export default instance;
