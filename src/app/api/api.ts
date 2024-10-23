import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://rzsxmvcdsg.us-east-1.awsapprunner.com/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export const setAuthorization = (token: string) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error),
    );
};

export default axiosInstance;
