// Import `LucideIcon` từ thư viện `lucide-react` để hiển thị icon
import { LucideIcon } from 'lucide-react'

// Import `NavLink` từ `react-router-dom` để tạo liên kết điều hướng với trạng thái active
import { NavLink } from 'react-router-dom'

// Import `TooltipWrapper` - component hiển thị tooltip khi hover vào icon
import TooltipWrapper from '@/components/ui/tooltip-wrapper'

// Import hàm `getIconSize` để lấy kích thước icon
import getIconSize from '@/utils/get-icon-size'


const iconProperties = getIconSize('l', true)

export default function IconLink({ Icon, title, to }: { Icon: LucideIcon; title: string; to: string }) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <TooltipWrapper side="right" tooltipContent={title}>
          <Icon
            className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-s-gray-lighter hover:text-white'
              }`}
            {...iconProperties}
          />
        </TooltipWrapper>
      )}
    </NavLink>
  )
}
