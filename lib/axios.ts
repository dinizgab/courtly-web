const axios = require('axios');

const env = process.env.ENVIRONMENT || 'development';
const apiUrl = env === 'production' ? 'https://booking-mvp-production.up.railway.app' : 'http://localhost:8000';

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
