// Import `PinIcon` từ thư viện `lucide-react`, biểu tượng cái ghim để hiển thị khi thư viện được ghim
import { PinIcon } from 'lucide-react';

// Import hàm `getIconSize` từ thư viện nội bộ để lấy kích thước icon dựa trên kích thước chỉ định
import getIconSize from '@/utils/get-icon-size';

// Định nghĩa component `LibraryCardContent` nhận vào các props
export default function LibraryCardContent({
  isPinned, // Trạng thái thư viện có được ghim hay không
  name, // Tên của thư viện
  songCount, // Số lượng bài hát trong thư viện (kiểu `number` hoặc `string`)
}: {
  isPinned: boolean; // Xác định xem thư viện có được ghim không (true/false)
  name: string; // Tên thư viện
  songCount: number | string; // Số lượng bài hát (có thể là số hoặc chuỗi)
}) {
  return (
    // Chứa nội dung của thẻ thư viện, sử dụng flexbox để sắp xếp các thành phần theo chiều dọc
    <div className="flex flex-col">

      {/* Hiển thị tên thư viện với font-size `base` và không có khoảng cách dòng dư thừa */}
      <div className="text-base leading-none">{name}</div>

      {/* Dòng hiển thị số lượng bài hát và biểu tượng ghim nếu thư viện được ghim */}
      <div className="flex flex-row items-end gap-2 py-1">

        {/* Nếu thư viện được ghim (`isPinned === true`), hiển thị icon ghim (`PinIcon`) */}
        {isPinned ? <PinIcon className="text-s-green" {...getIconSize('s', true)} /> : undefined}{' '}

        {/* Hiển thị số lượng bài hát trong thư viện */}
        <p className="text-base leading-none text-s-gray-lighter">{songCount} songs</p>

      </div>
    </div>
  );
}
// Giải thích chi tiết
// Import thư viện và module:

// PinIcon: Biểu tượng cái ghim dùng để đánh dấu thư viện đã được ghim.
//   getIconSize: Hàm lấy kích thước icon, giúp xác định kích thước phù hợp theo một giá trị(s, m, l...).
// Khai báo LibraryCardContent:

// Đây là một functional component nhận vào ba props:
// isPinned: Boolean(true / false) để xác định thư viện có được ghim hay không.
//   name: Chuỗi chứa tên của thư viện.
//     songCount: Số lượng bài hát trong thư viện(có thể là kiểu số hoặc chuỗi).
// Hiển thị nội dung của thư viện:

// Dòng đầu tiên hiển thị tên thư viện với kích thước chữ base.
// Dòng thứ hai gồm:
// Biểu tượng ghim(PinIcon): Chỉ hiển thị nếu isPinned === true, có màu text - s - green.
// Số lượng bài hát: Hiển thị dưới dạng x songs, với màu chữ text - s - gray - lighter.