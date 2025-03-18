import { Playlist } from '@/types/types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // URL Django server

export const loginUser = async (userData: any) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/nguoidung/api/dang-nhap`,
            userData, // Không cần `JSON.stringify()`, Axios tự động convert
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // 🚀 Quan trọng để gửi và nhận cookie
            }
        );
        return response.data; // Trả về dữ liệu từ server
    } catch (error : any) {
        // console.error("Đăng nhập thất bại:", error);
        return error.response.data;
    }
};



export const logoutUser = async () => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/nguoidung/api/dang-xuat`,
            null ,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // 🚀 Quan trọng để gửi và nhận cookie
            }
        );

        return response.data; // Trả về dữ liệu từ server
    } catch (error) {
        console.error("Đăng xuất thất bại:", error);
        return error
    }
};


