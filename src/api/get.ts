import { AxiosError } from 'axios';
import api from './api';


async function get(path: string) {
    try {
        const response = await api.get(path);
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            return { status: error?.response?.status, data: error?.response?.data };
        }
        return { status: 500, data: 'unknow error' };
    }
}

export default get;