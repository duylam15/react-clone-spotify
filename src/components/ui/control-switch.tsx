import { cva } from 'class-variance-authority';
// Import `cva` từ thư viện `class-variance-authority` để tạo các biến thể class linh hoạt.

import { LucideIcon } from 'lucide-react';
// Import kiểu `LucideIcon` từ thư viện `lucide-react`, giúp đảm bảo `Icon` nhận đúng kiểu icon.

import { memo } from 'react';
// Import `memo` từ React để ghi nhớ component, tránh render lại không cần thiết.

import { cn } from '@/utils/utils';
// Import hàm `cn`, có thể là một utility giúp kết hợp nhiều className một cách linh hoạt.

import ControlButton from './control-button';
// Import component `ControlButton`, dùng để hiển thị nút bấm có icon và tooltip.

interface Properties {
  className?: string; // Thuộc tính class bổ sung cho button.
  switchControl?: boolean; // Nếu true, áp dụng style khác cho button.
  tooltipText?: string; // Nội dung hiển thị trong tooltip khi di chuột vào button.
  size?: number; // Kích thước icon, mặc định là 18.
  Icon: LucideIcon; // Component icon từ thư viện `lucide-react`.
  onClick: () => void; // Hàm xử lý sự kiện khi nhấn vào button.
}

// Định nghĩa các biến thể class cho button bằng `cva`
const buttonVariants = cva('', {
  variants: {
    switchControl: {
      true: 'text-s-green hover:text-s-green-light',
      // Khi `switchControl=true`, button có màu xanh `text-s-green`, hover đổi thành `text-s-green-light`.
      false: 'text-s-gray-lighter hover:text-s-gray-lightest',
      // Khi `switchControl=false`, button có màu `text-s-gray-lighter`, hover đổi thành `text-s-gray-lightest`.
    },
  },
});

// Định nghĩa component `ControlSwitchComponent`
function ControlSwitchComponent({
  className,
  switchControl = false,
  size = 18,
  tooltipText,
  Icon,
  onClick,
}: Properties) {
  return (
    <ControlButton
      className={cn(buttonVariants({ switchControl, className }))}
      // Áp dụng class style phù hợp dựa trên giá trị `switchControl` và `className`.
      Icon={Icon}
      // Truyền component icon để hiển thị trong button.
      onClick={onClick}
      // Gọi hàm `onClick` khi người dùng nhấn button.
      size={size}
      // Truyền kích thước icon, mặc định là 18.
      tooltipText={tooltipText}
    // Truyền nội dung tooltip để hiển thị khi di chuột vào button.
    />
  );
}

// Gói component `ControlSwitchComponent` trong `memo` để tối ưu hiệu suất
const ControlSwitch = memo(ControlSwitchComponent);

// Đặt tên hiển thị cho component trong React DevTools
ControlSwitch.displayName = 'ControlSwitch';

// Xuất component `ControlSwitch` để sử dụng trong các phần khác của ứng dụng.
export default ControlSwitch;
