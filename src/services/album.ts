const API_BASE_URL = "http://localhost:8000"; 
import axios from 'axios';

export const getAlbum = async (page: number, size: number, search: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/album/search/?page=${page}&size=${size}&search=${search}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching nghe si", error);
        throw error;
    }
};

export const updateAlbum = async (data: any, idAlbum: number) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/album/capnhat/${idAlbum}/`, data);
        return response.data;
    } catch (error) {
        console.error("Error fetching nghe si", error);
        throw error;
    }
};