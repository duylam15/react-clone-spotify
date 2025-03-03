// Import kiểu dữ liệu `ClassValue` và hàm `clsx` từ thư viện `clsx`.
// - `ClassValue`: Kiểu dữ liệu đại diện cho các class CSS (có thể là string, object, array, v.v.).
// - `clsx`: Hàm giúp xử lý các class động, hỗ trợ kết hợp, điều kiện và tối ưu hóa class.
import { type ClassValue, clsx } from 'clsx';

// Import `twMerge` từ thư viện `tailwind-merge`.
// - `twMerge`: Giúp hợp nhất các class của Tailwind CSS, ưu tiên class sau nếu có xung đột.
import { twMerge } from 'tailwind-merge';

// Định nghĩa hàm `cn`, nhận vào danh sách `inputs` chứa các class CSS.
// - `...inputs`: Dùng Rest Parameter để nhận nhiều class dưới dạng array.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)); // Kết hợp `clsx` và `twMerge` để xử lý class.
}
