import { GripVertical } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'

// Component `ResizablePanelGroup`
const ResizablePanelGroup = ({
  ...properties
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    {...properties}
  />
)

// Alias
const ResizablePanel = ResizablePrimitive.Panel
export type IResizablePanel = ResizablePrimitive.ImperativePanelHandle

// Component `ResizableHandle`
const ResizableHandle = ({
  className = '',
  withHandle,
  ...properties
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    {...properties}
  >
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
