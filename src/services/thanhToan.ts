const API_BASE_URL = "http://localhost:8000"; 
import axios from 'axios';

export const taoThanhToan = async (data: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/thanhtoan`, data);
        return response.data;
    } catch (error) {
        console.error("Error create paypal", error);
        throw error;
    }
};