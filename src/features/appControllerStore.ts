// Import `create` từ thư viện `zustand`, giúp tạo state management đơn giản trong React.
import { create } from 'zustand';

// Định nghĩa interface `PlayerControllerStore` để mô tả cấu trúc state của store.
interface PlayerControllerStore {
  mainWidth: number; // Chiều rộng chính của trình phát.
  isPanelExpanded?: boolean; // Trạng thái mở rộng của panel, có thể không bắt buộc (optional).
  isDetailsOpen: boolean; // Trạng thái hiển thị chi tiết.
  setMainWidth: (width: number) => void; // Hàm cập nhật `mainWidth`.
  setPanel: (setTo: boolean) => void; // Hàm cập nhật trạng thái mở rộng của panel.
  toggleDetails: () => void; // Hàm bật/tắt chi tiết.
}

// Tạo store Zustand có tên `useAppControllerStore` sử dụng `create`.
export const useAppControllerStore = create<PlayerControllerStore>(function playerControllerStore(set) {
  return {
    mainWidth: 0, // Giá trị mặc định của `mainWidth` là 0.
    isPanelExpanded: false, // Mặc định panel không mở rộng.
    isDetailsOpen: false, // Mặc định chi tiết bị đóng.

    // Hàm `setMainWidth` để cập nhật `mainWidth`.
    setMainWidth: (width: number) => set((state) => ({ ...state, mainWidth: width })),

    // Hàm `setPanel` để cập nhật trạng thái mở rộng của panel.
    setPanel: (setTo: boolean) => set((state) => ({ ...state, isPanelExpanded: setTo })),

    // Hàm `toggleDetails` để thay đổi trạng thái của `isDetailsOpen`.
    toggleDetails: () => set((state) => ({ ...state, isDetailsOpen: !state.isDetailsOpen })),
  };
});
