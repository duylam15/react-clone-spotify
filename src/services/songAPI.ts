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


export const getBaiHat_PhanTrang = async (page: number, size: number, search: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/baihat/api/pagination/?page=${page}&size=${size}&search=${search}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching nghe si", error);
        throw error;
    }
};

export const addBaiHat = async (formData: FormData) => {
  return axios.post(`${API_BASE_URL}/baihat/baihat/them/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const updateBaiHat = async (formData: FormData, id: number) => {
  return axios.put(`${API_BASE_URL}/baihat/baihat/capnhat/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const lockBaiHat = async (idBaiHat: number) => {
  try {
      const response = await axios.patch(`${API_BASE_URL}/api/nghesi/lock/${idBaiHat}`);
      return response.data;
  } catch (error) {
      console.error("Error locking nghe si", error);
      throw error;
  }
};

export const unlockBiaHat = async (idBaiHat: number) => {
  try {
      const response = await axios.patch(`${API_BASE_URL}/api/nghesi/unlock/${idBaiHat}`);
      return response.data;
  } catch (error) {
      console.error("Error unlocking nghe si", error);
      throw error;
  }
};