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

interface SongState {
  currentSong: Song | null;
}

const initialState: SongState = {
  currentSong: null,
};

const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
    setCurrentSong: (state: any, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
    },
  },
});

export const { setCurrentSong } = songSlice.actions;
export default songSlice.reducer;
