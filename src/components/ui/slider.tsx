import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

// Tạo component `Slider` sử dụng `forwardRef`
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className = '', ...properties }, reference) => (
  <SliderPrimitive.Root
    ref={reference}
    {...properties}
    className={`group relative flex h-3 w-full touch-none rounded-full select-none items-center ${className}`}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-s-gray dark:bg-s-white">
      <SliderPrimitive.Range className="absolute h-full bg-s-white group-hover:bg-s-green dark:bg-s-gray-dark" />
    </SliderPrimitive.Track>

    <SliderPrimitive.Thumb />
  </SliderPrimitive.Root>
))

export { Slider }
