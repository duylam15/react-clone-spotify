const API_BASE_URL = "http://localhost:8000"; 
import axios from 'axios';

export const getNgheSi = async (page: number, size: number, search: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/nghesi/list?page=${page}&size=${size}&search=${search}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching nghe si", error);
        throw error;
    }
};

export const updateNgheSi = async (data: any, idNgheSi: number) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/nghesi/update/${idNgheSi}`, data);
        return response.data;
    } catch (error) {
        console.error("Error fetching nghe si", error);
        throw error;
    }
};

export const lockNgheSi = async (idNgheSi: number) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/api/nghesi/lock/${idNgheSi}`);
        return response.data;
    } catch (error) {
        console.error("Error locking nghe si", error);
        throw error;
    }
};

export const unlockNgheSi = async (idNgheSi: number) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/api/nghesi/unlock/${idNgheSi}`);
        return response.data;
    } catch (error) {
        console.error("Error unlocking nghe si", error);
        throw error;
    }
};

