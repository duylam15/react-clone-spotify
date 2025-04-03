// Import kiểu dữ liệu `ClassValue` và hàm `clsx` từ thư viện `clsx`.
// - `ClassValue`: Kiểu dữ liệu đại diện cho các class CSS (có thể là string, object, array, v.v.).
// - `clsx`: Hàm giúp xử lý các class động, hỗ trợ kết hợp, điều kiện và tối ưu hóa class.
import { type ClassValue, clsx } from "clsx";
// Import `twMerge` từ thư viện `tailwind-merge`.
// - `twMerge`: Giúp hợp nhất các class của Tailwind CSS, ưu tiên class sau nếu có xung đột.
import { twMerge } from "tailwind-merge";

// Định nghĩa hàm `cn`, nhận vào danh sách `inputs` chứa các class CSS.
// - `...inputs`: Dùng Rest Parameter để nhận nhiều class dưới dạng array.
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs)); // Kết hợp `clsx` và `twMerge` để xử lý class.
}

export const formatThoiLuong = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function formatSecondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours > 0 ? `${hours} hr ` : ""}${minutes} min`;
}