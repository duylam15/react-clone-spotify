import { LucideIcon } from 'lucide-react'
import { memo } from 'react'

import ControlButton from './control-button'

interface Properties {
  className?: string
  switchControl?: boolean
  tooltipText?: string
  size?: number
  Icon: LucideIcon
  onClick: () => void
}

function ControlSwitchComponent({
  className = '',
  switchControl = false,
  size = 18,
  tooltipText,
  Icon,
  onClick,
}: Properties) {
  const colorClass = switchControl
    ? 'text-s-green hover:text-s-green-light'
    : 'text-s-gray-lighter hover:text-s-gray-lightest'

  const combinedClass = ` ${colorClass} ${className}`.trim()

  return (
    <ControlButton
      className={combinedClass}
      Icon={Icon}
      onClick={onClick}
      size={size}
      tooltipText={tooltipText}
    />
  )
}

const ControlSwitch = memo(ControlSwitchComponent)
ControlSwitch.displayName = 'ControlSwitch'

export default ControlSwitch
