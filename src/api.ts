import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // твой Laravel URL
});

console.log(import.meta.env.VITE_API_URL)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;
