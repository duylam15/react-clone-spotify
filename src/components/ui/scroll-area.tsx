import { Corner, Root, ScrollAreaScrollbar, ScrollAreaThumb, Viewport } from '@radix-ui/react-scroll-area'
import { ReactNode } from 'react'

interface ScrollAreaProps {
  className?: string
  children: ReactNode
  [key: string]: any // Cho phép truyền thêm props khác vào
}

const ScrollArea = ({ className = '', children, ...properties }: ScrollAreaProps) => (
  <Root className={`relative overflow-hidden ${className}`} {...properties}>
    <Viewport className="size-full rounded-[inherit]">{children}</Viewport>
    <ScrollBar />
    <Corner />
  </Root>
)
// Component `ScrollBar`
const ScrollBar = ({ orientation = 'vertical', ...properties }) => (
  <ScrollAreaScrollbar
    orientation='vertical'
    className="flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-[1px]"
    {...properties}
  >
    <ScrollAreaThumb className="relative flex-1 rounded-full bg-s-gray-lighter/50 hover:bg-s-gray-light/50 dark:bg-zinc-800" />
  </ScrollAreaScrollbar>
)

export { ScrollArea, ScrollBar }
