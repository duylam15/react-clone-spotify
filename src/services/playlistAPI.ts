import { Playlist } from '@/types/types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';  // URL Django server

export const getPlayList = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/danhsachphat/`);

        return response.data.map(convertPlaylistFromBackend);
    } catch (error) {
        console.error("Error fetching users", error);
        throw error;
    }
};

export function convertPlaylistFromBackend(data: any): Playlist {
    return {
      id: data.danh_sach_phat_id.toString(), // Chuyển ID thành string
      order: data.so_thu_tu || 0, // Nếu không có giá trị thì mặc định 0
      title: data.ten_danh_sach,
      image: data.anh_danh_sach,
      followers: data.so_nguoi_theo_doi,
      description: data.mo_ta || "", // Nếu mô tả trống thì mặc định ""
    };
  }