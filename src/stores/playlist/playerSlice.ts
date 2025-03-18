import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Song {
  bai_hat_id: number;
  ten_bai_hat: string;
  nghe_si: string;
  ten_album: string;
  the_loai: string;
  duong_dan: string;
  loi_bai_hat: string;
  thoi_luong: number;
  ngay_phat_hanh: string;
}

interface PlayerState {
  currentSong: Song | null;
  isPaused: boolean;
}

const initialState: PlayerState = {
  currentSong: null,
  isPaused: true,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
      state.isPaused = false; // Khi chọn bài hát mới, tự động phát
    },
    togglePlayPause: (state) => {
      state.isPaused = !state.isPaused;
    },
  },
});

export const { setCurrentSong, togglePlayPause } = playerSlice.actions;
export default playerSlice.reducer;
