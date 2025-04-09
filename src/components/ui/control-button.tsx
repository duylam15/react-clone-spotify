import { LucideIcon } from 'lucide-react'
import { memo } from 'react'

import TooltipWrapper from './tooltip-wrapper'

interface Properties {
  className?: string
  button?: boolean
  tooltipText?: string
  size?: number
  Icon: LucideIcon
  onClick: () => void
}


function ControlButtonComponent({ className = '', button, size = 18, tooltipText, Icon, onClick }: Properties) {
  const baseClass = 'flex items-center justify-center rounded-full p-2'
  const buttonClass = button ? 'text-s-gray-lighter hover:text-s-gray-lightest' : ''
  const combinedClass = `${baseClass} ${buttonClass} ${className}`.trim()
  const iconProperty = { size: 26, strokeWidth: 2.5 }

  return (
    <TooltipWrapper tooltipContent={tooltipText}>
      <button className={combinedClass} onClick={onClick}>
        <Icon {...iconProperty} size={size} />
      </button>
    </TooltipWrapper>
  )
}

const ControlButton = memo(ControlButtonComponent)
ControlButton.displayName = 'ControlButton'

export default ControlButton
