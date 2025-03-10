import axios from 'axios';
import { Song } from '@/types/types';

const API_BASE_URL = 'http://localhost:8000';  // URL Django server

export const getSongs = async (): Promise<Song[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/baihat/baihat/`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài hát:", error);
      throw error;
    }
}
