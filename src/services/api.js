import axios from 'axios';

// The old `.env` variables from quasar usually looked like this, we'll map them to import.meta.env
// For development, we assume the backend is running locally or we point to the production server.
const api = axios.create({
    baseURL: import.meta.env.VITE_NEURONA_API_ENDPOINT || 'http://localhost:8000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to auto-inject the auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-handle 401s (Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            // In a real app we might redirect to /login here
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
