// Import `useMemo` từ React để tối ưu hóa hiệu suất
import { useMemo } from 'react'

// Import `TooltipWrapper` - một component hiển thị tooltip khi hover
import TooltipWrapper from '@/components/ui/tooltip-wrapper'

// Import các component con `LibraryCardContent` và `LibraryCardImage`
import LibraryCardContent from './library-card-content'
import LibraryCardImage from './library-card-image'


interface Properties {
  isCollapsed?: boolean // Xác định xem thẻ có hiển thị rút gọn hay không (mặc định là `true`)
  isPinned: boolean // Xác định xem thư viện có được ghim hay không
  library: {
    image?: string // Ảnh đại diện của thư viện (có thể không có)
    name: string // Tên thư viện
    songCount: number // Số lượng bài hát trong thư viện
  }
}


export default function LibraryCard({
  isCollapsed = true, // Mặc định thẻ hiển thị ở dạng rút gọn
  isPinned,
  library: { image, name, songCount },
}: Properties): React.ReactNode {

  const tooltipContent = useMemo(
    () => <LibraryCardContent isPinned={isPinned} name={name} songCount={songCount} />,
    [isPinned, name, songCount], // Chỉ tính toán lại khi các giá trị này thay đổi
  )


  return isCollapsed ? (
    <TooltipWrapper side="right" sideOffset={12} tooltipContent={tooltipContent}>
      <div className="flex items-center rounded-lg p-2 transition-colors duration-300 hover:bg-s-gray-darker">
        <LibraryCardImage image={image} />
      </div>
    </TooltipWrapper>
  ) : (
    <div className="rounded-lg p-2 transition-colors duration-300 hover:bg-s-gray-dark">
      <div className="flex items-center gap-2">
        <LibraryCardImage />
        <div className="flex flex-col">{tooltipContent}</div>
      </div>
    </div>
  )
}
