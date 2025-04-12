import { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import TooltipWrapper from '@/components/ui/tooltip-wrapper'

export default function IconLink({ Icon, title, to }: { Icon: LucideIcon; title: string; to: string }) {
  const iconProperties = { size: 26, strokeWidth: 2.5 }
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
