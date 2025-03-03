// Import `Content` từ thư viện `@radix-ui/react-tooltip`, đây là phần hiển thị nội dung của tooltip.
import { Content } from '@radix-ui/react-tooltip';

// Import các kiểu dữ liệu `ComponentPropsWithoutRef` và `ElementRef` từ React.
// `ComponentPropsWithoutRef`: Lấy tất cả các props của một component trừ `ref`.
// `ElementRef`: Lấy kiểu của phần tử DOM từ một component.
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

// Import hàm `cn` từ thư viện nội bộ (`@/lib/utils`) để xử lý lớp CSS động.
import { cn } from '@/utils/utils';

// Định nghĩa component `TooltipContent` sử dụng `forwardRef` để chuyển tiếp `ref` đến phần tử DOM thực tế.
const TooltipContent = forwardRef<
  ElementRef<typeof Content>, // Xác định kiểu `ref` trỏ đến phần tử `Content` của `@radix-ui/react-tooltip`.
  ComponentPropsWithoutRef<typeof Content> // Lấy tất cả các props của `Content` trừ `ref`.
>(({ className, sideOffset = 4, ...properties }, reference) => (

  // Trả về phần tử `Content` được bọc trong `forwardRef`.
  <Content
    className={cn(
      // Các lớp CSS để tạo tooltip với hiệu ứng động.
      'z-50 overflow-hidden rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-950 shadow-md',
      'animate-in fade-in-0 zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      'dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50',
      className, // Thêm className được truyền từ props.
    )}
    ref={reference} // Truyền `ref` để có thể điều khiển tooltip từ bên ngoài.
    sideOffset={sideOffset} // Định nghĩa khoảng cách giữa tooltip và phần tử kích hoạt, mặc định là 4px.
    {...properties} // Truyền tất cả các props còn lại.
  />
));

// Đặt tên hiển thị cho component, giúp dễ dàng debug hơn trong React DevTools.
TooltipContent.displayName = Content.displayName;

// Xuất `TooltipContent` để có thể sử dụng trong các file khác.
export { TooltipContent };

// Xuất các thành phần quan trọng từ `@radix-ui/react-tooltip` để sử dụng trong tooltip.
export { Root as Tooltip, Provider as TooltipProvider, Trigger as TooltipTrigger } from '@radix-ui/react-tooltip';
