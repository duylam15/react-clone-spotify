import { Playlist } from '@/types/types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000'; // URL Django server

const handleUnauthorized = () => {
    alert("⚠️ Bạn cần đăng nhập để thực thi  tác vụ này");
};

const fetchAccessToken = async (onError : any) => {
    try {
        const response = await axios.get("http://localhost:8000/nguoidung/api/get-access-token", {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // 🚀 Quan trọng để gửi và nhận cookie
        });
        return response.data.access_token;
    } catch (error : any) {
        if (error.response && error.response.status === 401) {
            if (onError) onError(); // Gọi hàm xử lý lỗi được truyền vào
            window.location.href = "/login"; // 🔥 Chuyển hướng về trang chủ
        } else {
            console.error("Lỗi khi lấy access token:", error);
        }
        return null;
    }
};

export const getUserInfo = async () => {
    try {
        const token = await fetchAccessToken(handleUnauthorized);
        if (!token){
            handleUnauthorized();
            window.location.href = "/login";
        }

        const response = await axios.get(`${API_BASE_URL}/nguoidung/api/thong-tin-nguoi-dung`, {
            // headers: {
            //     "Content-Type": "application/json",
            // },
            withCredentials: true, // 🚀 Quan trọng để gửi và nhận cookie
        });

        const data = await response.data;

        return await data; // Trả về dữ liệu JSON
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return null; // Xử lý lỗi
    }
};


export const forgotPassword = async (sendData : any) => {
    try {

        const response = await axios.post(
            `${API_BASE_URL}/nguoidung/api/forgot-password`, 
            sendData,
        );

        return await response; // Trả về dữ liệu JSON
    } catch (error : any) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return error.response; // Xử lý lỗi
    }
};


export const UserInfo = async () => {
    try {
                const user = await getUserInfo();
                return user
            } catch (error) {
                console.error("Lỗi khi lấy user info:", error);
            }
}