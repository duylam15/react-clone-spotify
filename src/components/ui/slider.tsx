// Import tất cả các thành phần của slider từ thư viện `@radix-ui/react-slider`.
// Thư viện này giúp tạo slider tùy chỉnh với các tính năng nâng cao.
import * as SliderPrimitive from '@radix-ui/react-slider';

// Import React để sử dụng forwardRef và các kiểu dữ liệu.
import * as React from 'react';

// Import hàm `cn` từ thư viện utils để kết hợp nhiều class lại với nhau một cách linh hoạt.
import { cn } from '@/utils/utils';

// Tạo component `Slider` sử dụng `forwardRef` để cho phép truyền ref vào component.
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>, // Xác định kiểu ref cho `SliderPrimitive.Root`.
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> // Xác định kiểu props dựa trên `SliderPrimitive.Root`.
>(({ className, ...properties }, reference) => (
  // `SliderPrimitive.Root` là phần tử chính của slider.
  <SliderPrimitive.Root
    className={cn(
      'group relative flex h-3 w-full touch-none rounded-full select-none items-center', // Thiết lập chiều cao, chiều rộng, bo góc, và bố cục.
      className, // Gộp thêm className từ props nếu có.
    )}
    ref={reference} // Gán ref cho phần tử slider.
    {...properties} // Truyền tất cả các thuộc tính còn lại vào `SliderPrimitive.Root`.
  >
    {/* `SliderPrimitive.Track` là thanh trượt của slider. */}
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-s-gray dark:bg-s-white">
      {/* `SliderPrimitive.Range` là phần đã trượt của slider. */}
      <SliderPrimitive.Range className="absolute h-full bg-s-white group-hover:bg-s-green dark:bg-s-gray-dark " />
    </SliderPrimitive.Track>

    {/* `SliderPrimitive.Thumb` là nút kéo của slider. */}
    <SliderPrimitive.Thumb className="
      block size-3 rounded-full border-2 bg-s-white opacity-0 shadow ring-offset-s-white transition-colors 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-s-gray-darkest focus-visible:ring-offset-2 
      disabled:pointer-events-none disabled:opacity-50 group-hover:opacity-100 
      dark:border-s-white dark:bg-s-gray-darkest dark:ring-offset-s-gray-darkest dark:focus-visible:ring-s-gray-lighter
    " />
  </SliderPrimitive.Root>
));

// Đặt `displayName` cho component `Slider` để hỗ trợ debug trong DevTools.
Slider.displayName = SliderPrimitive.Root.displayName;

// Xuất component `Slider` để sử dụng ở nơi khác trong ứng dụng.
export { Slider };
