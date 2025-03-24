// Import biểu tượng `GripVertical` từ thư viện `lucide-react`.
// `GripVertical` là một icon gồm 6 chấm dọc, thường dùng làm biểu tượng kéo thả.
import { GripVertical } from 'lucide-react'

// Import toàn bộ module `react-resizable-panels` vào `ResizablePrimitive`.
// Thư viện này cung cấp các thành phần giúp tạo layout có thể thay đổi kích thước bằng cách kéo thả.
import * as ResizablePrimitive from 'react-resizable-panels'

// Import hàm `cn` từ thư viện utils để kết hợp nhiều class lại với nhau một cách linh hoạt.
import { cn } from '@/utils/utils'

// Component `ResizablePanelGroup` để tạo một nhóm panel có thể thay đổi kích thước.
const ResizablePanelGroup = ({
  className, // Thuộc tính className cho phép tuỳ chỉnh CSS bên ngoài.
  ...properties // Spread tất cả thuộc tính còn lại để đảm bảo component hoạt động như `PanelGroup`.
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    // Kết hợp class mặc định với `className` truyền vào.
    className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
    {...properties} // Truyền tất cả thuộc tính còn lại cho `PanelGroup`.
  />
)

// Component `ResizablePanel` dùng để tạo từng panel riêng lẻ.
// Chỉ là một alias (định danh lại) cho `ResizablePrimitive.Panel` để dễ sử dụng.
const ResizablePanel = ResizablePrimitive.Panel

// Định nghĩa kiểu dữ liệu `IResizablePanel`, dùng cho các tham chiếu điều khiển Panel.
export type IResizablePanel = ResizablePrimitive.ImperativePanelHandle

// Component `ResizableHandle` là thanh kéo để thay đổi kích thước giữa các panel.
const ResizableHandle = ({
  className, // Thuộc tính className để tuỳ chỉnh CSS.
  withHandle, // Biến `withHandle` xác định có hiển thị icon kéo thả không.
  ...properties // Spread tất cả thuộc tính còn lại để đảm bảo component hoạt động như `PanelResizeHandle`.
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean // `withHandle` là một boolean tuỳ chọn, mặc định là `false`.
}) => (
  <ResizablePrimitive.PanelResizeHandle
    // Kết hợp class mặc định với `className` truyền vào.
    className={cn(
      'relative flex w-[2px] items-center justify-center hover:bg-zinc-500 ' + // Thanh kéo có chiều rộng 1px và đổi màu khi hover.
      'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 ' + // Thanh phụ trợ để căn chỉnh vị trí chính xác.
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:ring-offset-1 ' + // Hiển thị đường viền khi focus bằng bàn phím.
      'data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full ' + // Khi nhóm panel ở dạng dọc, đổi chiều ngang thành dọc.
      'data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full ' + // Điều chỉnh thanh ngang khi ở chế độ dọc.
      'data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 ' + // Định vị chính xác thanh kéo trong chế độ dọc.
      '[&[data-panel-group-direction=vertical]>div]:rotate-90 hover:dark:bg-zinc-800 dark:focus-visible:ring-zinc-300', // Xoay 90 độ khi panel ở chế độ dọc, đổi màu khi hover ở dark mode.
      className, // Gộp thêm className từ props.
    )}
    {...properties} // Truyền tiếp các thuộc tính khác cho `PanelResizeHandle`.
  >
    {withHandle && ( // Nếu `withHandle` là `true`, hiển thị nút kéo với biểu tượng.
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border hover:border-zinc-500 hover:bg-zinc-500 hover:dark:border-zinc-800 hover:dark:bg-zinc-800">
        <GripVertical className="size-2.5" /> {/* Icon kéo thả `GripVertical` */}
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

// Xuất các component để sử dụng ở nơi khác trong ứng dụng.
export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
