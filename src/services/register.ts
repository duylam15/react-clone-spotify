import { Playlist } from '@/types/types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // URL Django server


export const registerUser = async (userData: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/nguoidung/api/them-nguoi-dung/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json(); // Chuyển response thành JSON

        if (!response.ok) {
            throw data; // Ném lỗi để bắt ở phần `catch`
        }

        return await data;
    } catch (error) {
        throw error;
    }
};
