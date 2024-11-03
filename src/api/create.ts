import { AxiosError } from 'axios';
import api from './api';

async function create({ path, body }: { path: string; body: object }) {
    try {
        const response = await api.post(path, body);
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            return { status: error?.response?.status, data: error?.response?.data };
        }
        return { status: 500, data: 'unknow error' };
    }
}

export default create;