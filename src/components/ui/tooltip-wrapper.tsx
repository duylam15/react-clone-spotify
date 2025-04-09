import { useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type TooltipSide = 'bottom' | 'left' | 'right' | 'top'

interface Properties {
  children: React.ReactNode
  side?: TooltipSide
  sideOffset?: number
  tooltipContent?: React.ReactNode | string | undefined
}

export default function TooltipWrapper({
  children,
  side = 'top',
  sideOffset = 8,
  tooltipContent,
}: Properties): React.ReactNode {
  const memoizedContent = useMemo(() => {
    if (tooltipContent == undefined) return
    return tooltipContent
  }, [tooltipContent])

  return tooltipContent == undefined ? (
    <>{children}</>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset}>
        {memoizedContent}
      </TooltipContent>
    </Tooltip>
  )
}
