// Import `useMemo` từ React để tối ưu hóa hiệu suất bằng cách ghi nhớ giá trị tính toán.
import { useMemo } from 'react';

// Import các thành phần Tooltip từ thư mục `components/ui/tooltip`.
// `Tooltip` là thành phần chính để hiển thị tooltip.
// `TooltipTrigger` là phần tử kích hoạt tooltip (thường là nút hoặc văn bản).
// `TooltipContent` là nội dung hiển thị trong tooltip.
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Xác định kiểu dữ liệu cho vị trí hiển thị tooltip (top, bottom, left, right).
type TooltipSide = 'bottom' | 'left' | 'right' | 'top';

// Định nghĩa interface `Properties` để xác định các props có thể truyền vào `TooltipWrapper`.
interface Properties {
  children: React.ReactNode; // Nội dung con (thành phần sẽ hiển thị tooltip khi hover).
  side?: TooltipSide; // Xác định vị trí của tooltip (mặc định là 'top').
  sideOffset?: number; // Khoảng cách giữa tooltip và phần tử kích hoạt (mặc định là 8px).
  tooltipContent?: React.ReactNode | string | undefined; // Nội dung của tooltip, có thể là chuỗi hoặc component React.
}

// Định nghĩa component `TooltipWrapper`, xuất mặc định để có thể import từ file khác.
export default function TooltipWrapper({
  children, // Thành phần con được bọc trong TooltipWrapper.
  side = 'top', // Vị trí mặc định của tooltip là 'top'.
  sideOffset = 8, // Khoảng cách mặc định giữa tooltip và phần tử kích hoạt.
  tooltipContent, // Nội dung của tooltip.
}: Properties): React.ReactNode {

  // Dùng `useMemo` để ghi nhớ nội dung của tooltip và tránh tính toán lại không cần thiết.
  const memoizedContent = useMemo(() => {
    if (tooltipContent == undefined) return; // Nếu không có nội dung tooltip, trả về `undefined`.
    return tooltipContent; // Trả về nội dung tooltip nếu có.
  }, [tooltipContent]); // Chỉ cập nhật giá trị khi `tooltipContent` thay đổi.

  // Nếu `tooltipContent` không được truyền vào, chỉ hiển thị `children` mà không có tooltip.
  return tooltipContent == undefined ? (
    <>{children}</> // Trả về trực tiếp nội dung con mà không bọc trong tooltip.
  ) : (
    // Nếu có `tooltipContent`, bọc nội dung trong Tooltip.
    <Tooltip>
      {/* TooltipTrigger là phần tử kích hoạt tooltip khi hover hoặc focus. */}
      <TooltipTrigger asChild>{children}</TooltipTrigger>

      {/* TooltipContent là phần hiển thị tooltip với các thuộc tính như vị trí và khoảng cách. */}
      <TooltipContent
        className="rounded border-0 bg-s-gray-darker p-1 px-2 text-white" // Định dạng giao diện tooltip.
        side={side} // Xác định vị trí tooltip.
        sideOffset={sideOffset} // Xác định khoảng cách giữa tooltip và phần tử kích hoạt.
      >
        {memoizedContent} {/* Hiển thị nội dung tooltip đã được ghi nhớ. */}
      </TooltipContent>
    </Tooltip>
  );
}
