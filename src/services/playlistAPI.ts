import { Playlist } from '@/types/types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // URL Django server

export const getPlayList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/danhsachphat/`);

    return response.data.map(convertPlaylistFromBackend);
  } catch (error) {
    console.error('Error fetching users', error);
    throw error;
  }
};

export const getPlayListById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/danhsachphat/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching playlist', error);
    throw error;
  }
};

export const getSongFromPlayList = async (id: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/thembaihatvaodanhsachphat/danhsachphat/lay_danh_sach_bai_hat/${id}/`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching playlist', error);
    throw error;
  }
};

export const getSongById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/baihat/baihat/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching playlist', error);
    throw error;
  }
};

export function convertPlaylistFromBackend(data: any): Playlist {
  return {
    danh_sach_phat_id: data.danh_sach_phat_id.toString(), // Chuyển ID thành string
    order: data.so_thu_tu || 0, // Nếu không có giá trị thì mặc định 0
    ten_danh_sach: data.ten_danh_sach,
    anh_danh_sach: data.anh_danh_sach,
    followers: data.so_nguoi_theo_doi,
    description: data.mo_ta || '', // Nếu mô tả trống thì mặc định ""
  };
}
