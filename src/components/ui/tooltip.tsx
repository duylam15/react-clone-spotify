import { Content } from '@radix-ui/react-tooltip'
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react'

// Định nghĩa component `TooltipContent` sử dụng `forwardRef`.
const TooltipContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ sideOffset = 4, ...properties }, reference) => (
  <Content
    className=
    "z-50 overflow-hidden rounded-md   px-3 py-1.5 text-sm  shadow-md first-line: animate-in fade-in-0 zoom-in-95  bg-gray-700 p-1 text-gray-100 border-none"
    ref={reference}
    sideOffset={sideOffset}
    {...properties}
  />
))

export { TooltipContent }
export { Root as Tooltip, Provider as TooltipProvider, Trigger as TooltipTrigger } from '@radix-ui/react-tooltip'
