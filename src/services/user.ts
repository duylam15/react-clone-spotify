import { Playlist } from '@/types/types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000'; // URL Django server

export const handleUnauthorized = () => {
    const confirmLogin = window.confirm("⚠️ Bạn cần đăng nhập để thực thi tác vụ này");
    if (confirmLogin) {
        window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
    }
};

export const fetchAccessToken = async (onError: any) => {
    try {
        const response = await axios.get("http://localhost:8000/nguoidung/api/get-access-token", {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // 🚀 Quan trọng để gửi và nhận cookie
        });
        return response.data.access_token;
    } catch (error: any) {
        console.log("errrrrrrrrrrrrrrro dang nhap : ")
        console.log(error)
        if (error.response && error.response.status === 401) {
            if (onError) onError(); // Gọi hàm xử lý lỗi được truyền vào
        } else {
            console.error("Lỗi khi lấy access token:", error);
        }
        return error;
    }
};

export const getUserInfo = async (id) => {
    try {
        const token = await fetchAccessToken(handleUnauthorized);

        const response = await axios.get(
            `${API_BASE_URL}/nguoidung/api/thong-tin-nguoi-dung?id=${id}`,
            {
                withCredentials: true, // 🚀 Quan trọng để gửi và nhận token
            }
        );

        const data = await response.data;

        return await data; // Trả về dữ liệu JSON
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return null; // Xử lý lỗi
    }
};


export const forgotPassword = async (sendData: any) => {
    try {

        const response = await axios.post(
            `${API_BASE_URL}/nguoidung/api/forgot-password`,
            sendData,
        );

        return await response; // Trả về dữ liệu JSON
    } catch (error: any) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return error.response; // Xử lý lỗi
    }
};

