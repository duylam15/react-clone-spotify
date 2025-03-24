import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu dữ liệu cho một bài hát
interface Song {
    bai_hat_id: number;
    ten_bai_hat: string;
    the_loai: string;
    duong_dan: string;
    loi_bai_hat: string;
    thoi_luong: string; // Định dạng thời lượng (ví dụ: "03:45")
    ngay_phat_hanh: string; // Định dạng ngày (ví dụ: "Oct 20, 2024")
    album_id?: number; // Có thể không có album nên để dấu `?`
    ten_album?: string;
    anh_bia?: string;
    nghe_si_id?: number;
    nghe_si?: string;
    anh_dai_dien?: string;
}

// Định nghĩa state cho Redux
interface SongState {
    songs: Song[];
}

// Giá trị mặc định của state
const initialState: SongState = {
    songs: [],
};

// Tạo slice cho Redux
const songSlice = createSlice({
    name: "songs",
    initialState,
    reducers: {
        // Action để cập nhật danh sách bài hát
        setReduxSongs: (state, action: PayloadAction<Song[]>) => {
            state.songs = action.payload;
        },
    },
});

// Xuất reducer và action
export const { setReduxSongs } = songSlice.actions;
export default songSlice.reducer;
