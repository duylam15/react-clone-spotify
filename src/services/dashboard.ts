const API_BASE_URL = "http://localhost:8000"; 
import axios from 'axios';

export const getSoLuongDSP = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/danhsachphat/api/get-so-luong-dsp/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching nghe si", error);
        throw error;
    }
};

export const getSoLuongNgheSi = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/nghesi/get-so-luong-nghe-si/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching nghe si", error);
        throw error;
    }
};
 

export const getSoLuongNguoiDung = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/nguoidung/api/get-so-luong-nguoi-dung/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching nghe si", error);
        throw error;
    }
};


export const getSoLuongBaiHat = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/baihat/api/get-so-luong-bai-hat/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching nghe si", error);
        throw error;
    }
};
 
 