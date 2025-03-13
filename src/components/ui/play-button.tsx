// Import `cva` từ thư viện `class-variance-authority` để tạo class CSS động theo biến thể (variants).
// Import `VariantProps` để hỗ trợ kiểu dữ liệu cho các biến thể.
import { cva, type VariantProps } from 'class-variance-authority'

// Import `PlayIcon` từ thư viện `lucide-react`, đây là một icon hình nút Play.
import { PlayIcon } from 'lucide-react'

// Import hàm `cn` từ thư viện utils để kết hợp nhiều class lại với nhau một cách linh hoạt.
import { cn } from '@/utils/utils'

// Định nghĩa biến `buttonVariants` để tùy chỉnh class CSS cho nút PlayButton.
const buttonVariants = cva(
  // Các class mặc định cho nút:
  'flex items-center justify-center rounded-full bg-s-green text-black hover:bg-s-green-light',
  {
    // Định nghĩa các biến thể (variants) của nút.
    variants: {
      size: {
        sm: 'size-[40px] hover:size-[42px]', // Kích thước nhỏ (40px, khi hover tăng lên 42px).
        md: 'size-[48px] hover:size-[50px]', // Kích thước trung bình (48px, khi hover tăng lên 50px).
        lg: 'size-[56px] hover:size-[58px]', // Kích thước lớn (56px, khi hover tăng lên 58px).
      },
    },
    // Biến thể mặc định nếu không chỉ định kích thước.
    defaultVariants: {
      size: 'md', // Mặc định kích thước là `md` (48px).
    },
  },
)

// Định nghĩa interface `ButtonProperties`, mở rộng từ thuộc tính của `<button>`.
// `VariantProps<typeof buttonVariants>` để hỗ trợ kiểu dữ liệu cho `size` (sm, md, lg).
interface ButtonProperties extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean // Nếu là `true`, component sẽ hiển thị dưới dạng `children`.
}

// Component `PlayButton` hiển thị một nút hình tròn chứa icon Play.
export default function PlayButton({ className, size, ...properties }: ButtonProperties): React.ReactNode {
  return (
    // Nút `<button>` với class được tạo bởi `buttonVariants` kết hợp với `className` truyền vào.
    <button className={cn(buttonVariants({ size, className }))} {...properties}>
      {/* Icon Play có kích thước cố định là 24px */}
      <PlayIcon size={24} color="black" />
    </button>
  )
}
