import { cva } from 'class-variance-authority';
// Import `cva` từ thư viện `class-variance-authority` để tạo các biến thể class linh hoạt.

import { LucideIcon } from 'lucide-react';
// Import kiểu `LucideIcon` từ thư viện `lucide-react`, giúp đảm bảo `Icon` nhận đúng kiểu icon.

import { memo } from 'react';
// Import `memo` từ React để ghi nhớ component, tránh render lại không cần thiết.

import getIconSize from '@/utils/get-icon-size';
// Import hàm `getIconSize`, có thể dùng để lấy kích thước icon theo tiêu chuẩn thiết kế.

import { cn } from '@/utils/utils';
// Import hàm `cn`, có thể là một utility giúp kết hợp nhiều className một cách linh hoạt.

import TooltipWrapper from './tooltip-wrapper';
// Import `TooltipWrapper`, một component giúp hiển thị tooltip khi di chuột vào.

interface Properties {
  className?: string; // Thuộc tính class bổ sung cho button.
  button?: boolean; // Nếu true, áp dụng style đặc biệt cho button.
  tooltipText?: string; // Nội dung hiển thị trong tooltip khi di chuột vào button.
  size?: number; // Kích thước icon, mặc định là 18.
  Icon: LucideIcon; // Component icon từ thư viện `lucide-react`.
  onClick: () => void; // Hàm xử lý sự kiện khi nhấn vào button.
}

// Định nghĩa các biến thể class cho button bằng `cva`
const buttonVariants = cva('flex items-center justify-center rounded-full p-2', {
  variants: {
    button: {
      true: 'text-s-gray-lighter hover:text-s-gray-lightest',
      // Khi `button=true`, áp dụng màu `text-s-gray-lighter`, hover đổi thành `text-s-gray-lightest`.
    },
  },
});

// Lấy thông số kích thước icon mặc định.
const iconProperty = getIconSize();

// Định nghĩa component `ControlButtonComponent`
function ControlButtonComponent({ className, button, size = 18, tooltipText, Icon, onClick }: Properties) {
  return (
    <TooltipWrapper tooltipContent={tooltipText}>
      {/* Hiển thị tooltip khi di chuột vào button */}
      <button className={cn(buttonVariants({ button, className }))} onClick={onClick}>
        {/* Button có thể thay đổi style dựa vào props */}
        <Icon {...iconProperty} size={size} />
        {/* Hiển thị icon với kích thước do props `size` xác định */}
      </button>
    </TooltipWrapper>
  );
}

// Gói component `ControlButtonComponent` trong `memo` để tối ưu hiệu suất
const ControlButton = memo(ControlButtonComponent);

// Đặt tên hiển thị cho component trong React DevTools
ControlButton.displayName = 'ControlButton';

// Xuất component `ControlButton` để sử dụng trong các phần khác của ứng dụng.
export default ControlButton;
