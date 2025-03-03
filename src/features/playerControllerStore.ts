// Import `create` từ thư viện `zustand`, dùng để tạo một store quản lý state trong React.
import { create } from 'zustand';

// Định nghĩa interface `PlayerControllerStore` để mô tả cấu trúc của store.
interface PlayerControllerStore {
  isRepeat: 'all' | 'one' | 'none'; // Trạng thái lặp lại: lặp toàn bộ danh sách ('all'), lặp 1 bài ('one') hoặc không lặp ('none').
  isShuffle: boolean; // Trạng thái phát ngẫu nhiên: true (bật) hoặc false (tắt).
  toggleRepeat: () => void; // Hàm chuyển đổi trạng thái lặp lại.
  toggleShuffle: () => void; // Hàm chuyển đổi trạng thái phát ngẫu nhiên.
}

// Tạo một store Zustand có tên `usePlayerControllerStore`, dùng để quản lý trạng thái của trình phát nhạc.
export const usePlayerControllerStore = create<PlayerControllerStore>(function playerControllerStore(set) {
  return {
    trackSource: '', // Biến này không có trong interface `PlayerControllerStore`, có thể là lỗi hoặc dư thừa.
    isRepeat: 'none', // Mặc định trạng thái lặp lại là không lặp.
    isShuffle: false, // Mặc định trạng thái phát ngẫu nhiên là tắt.

    // Hàm `toggleRepeat` để thay đổi trạng thái lặp lại theo vòng tuần tự: none -> all -> one -> none.
    toggleRepeat: () =>
      set((state) => {
        switch (state.isRepeat) {
          case 'none': {
            return { ...state, isRepeat: 'all' }; // Nếu đang ở trạng thái `none`, chuyển sang `all`.
          }
          case 'all': {
            return { ...state, isRepeat: 'one' }; // Nếu đang ở trạng thái `all`, chuyển sang `one`.
          }
          case 'one': {
            return { ...state, isRepeat: 'none' }; // Nếu đang ở trạng thái `one`, chuyển về `none`.
          }
        }
      }),

    // Hàm `toggleShuffle` để bật/tắt trạng thái phát ngẫu nhiên.
    toggleShuffle: () =>
      set((state) => ({
        ...state,
        isShuffle: !state.isShuffle, // Đảo ngược trạng thái hiện tại.
      })),
  };
});
