// Import hai biểu tượng `HomeIcon` và `SearchIcon` từ thư viện `lucide-react` để hiển thị icon trang chủ và tìm kiếm.
import { HomeIcon, SearchIcon } from 'lucide-react'

// Import `IconLink` - một component giúp tạo liên kết icon có tooltip.
import IconLink from './icon-link'

// Định nghĩa component `SidebarTop`, hiển thị các icon điều hướng ở đầu sidebar.
export default function SidebarTop(): React.ReactNode {
  return (
    // Container chính của phần đầu sidebar, có thiết lập kiểu dáng.
    <div className="flex w-full flex-col items-center gap-6 rounded-lg bg-s-gray-darkest py-4 text-white">

      {/* Liên kết đến trang chủ với biểu tượng Home */}
      <IconLink Icon={HomeIcon} title="Home" to="/" />

      {/* Liên kết đến trang tìm kiếm với biểu tượng Search */}
      <IconLink Icon={SearchIcon} title="Search" to="/search" />

    </div>
  )
}
