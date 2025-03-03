// Import các thành phần từ thư viện `@radix-ui/react-scroll-area` để tạo vùng cuộn tùy chỉnh.
import { Corner, Root, ScrollAreaScrollbar, ScrollAreaThumb, Viewport } from '@radix-ui/react-scroll-area';

// Import các kiểu dữ liệu từ React để làm việc với component và forwardRef.
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

// Import hàm `cn` từ thư viện utils để kết hợp nhiều class lại với nhau một cách linh hoạt.
import { cn } from '@/utils/utils';

// Component `ScrollArea` dùng để tạo vùng cuộn có thể tùy chỉnh.
// Sử dụng `forwardRef` để cho phép truyền ref vào component.
const ScrollArea = forwardRef<ElementRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(
  ({ className, children, ...properties }, reference) => (
    // `Root` là container chính của vùng cuộn, dùng `reference` để hỗ trợ ref bên ngoài.
    <Root ref={reference} className={cn('relative overflow-hidden', className)} {...properties}>
      {/* `Viewport` là phần tử chứa nội dung cuộn, đảm bảo chiếm toàn bộ kích thước của vùng cuộn. */}
      <Viewport className="size-full rounded-[inherit]">{children}</Viewport>

      {/* Gọi `ScrollBar` để hiển thị thanh cuộn. */}
      <ScrollBar />

      {/* `Corner` là phần góc giữa hai thanh cuộn khi cả cuộn ngang và dọc đều xuất hiện. */}
      <Corner />
    </Root>
  ),
);

// Đặt `displayName` cho component để giúp debug tốt hơn trong DevTools.
ScrollArea.displayName = Root.displayName;

// Component `ScrollBar` để tạo thanh cuộn dọc hoặc ngang.
const ScrollBar = forwardRef<
  ElementRef<typeof ScrollAreaScrollbar>, // Xác định kiểu ref cho `ScrollAreaScrollbar`.
  ComponentPropsWithoutRef<typeof ScrollAreaScrollbar> // Định nghĩa kiểu props dựa trên `ScrollAreaScrollbar`.
>(({ className, orientation = 'vertical', ...properties }, reference) => (
  <ScrollAreaScrollbar
    ref={reference} // Gán ref cho `ScrollAreaScrollbar`.
    orientation={orientation} // Xác định hướng thanh cuộn, mặc định là 'vertical'.
    className={cn(
      'flex touch-none select-none transition-colors', // Thiết lập thanh cuộn không thể chọn và có hiệu ứng màu khi thay đổi.
      orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]', // Nếu là thanh cuộn dọc.
      orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]', // Nếu là thanh cuộn ngang.
      className, // Gộp thêm className từ props nếu có.
    )}
    {...properties} // Truyền tất cả các thuộc tính còn lại vào `ScrollAreaScrollbar`.
  >
    {/* `ScrollAreaThumb` là phần hiển thị của thanh cuộn mà người dùng có thể kéo */}
    <ScrollAreaThumb className="relative flex-1 rounded-full bg-s-gray-lighter/50 hover:bg-s-gray-light/50 dark:bg-zinc-800" />
  </ScrollAreaScrollbar>
));

// Đặt `displayName` cho component `ScrollBar` để giúp debug tốt hơn.
ScrollBar.displayName = ScrollAreaScrollbar.displayName;

// Xuất các component để sử dụng ở nơi khác trong ứng dụng.
export { ScrollArea, ScrollBar };
