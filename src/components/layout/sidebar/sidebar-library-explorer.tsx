// Import biểu tượng `LibraryBig` từ thư viện `lucide-react` để hiển thị icon thư viện lớn.
import { LibraryBig } from 'lucide-react'

// Import `ScrollArea` - một component hỗ trợ cuộn nội dung trong UI.
import { ScrollArea } from '@/components/ui/scroll-area'

// Import `TooltipWrapper` - component hiển thị tooltip khi hover vào phần tử.
import TooltipWrapper from '@/components/ui/tooltip-wrapper'

// Import hàm `getIconSize` để lấy kích thước icon.
import getIconSize from '@/utils/get-icon-size'

// Import `LibraryCard` - component hiển thị thông tin một thư viện cụ thể.
import LibraryCard from './library-card/library-card'

// Danh sách các thư viện nhạc có sẵn trong sidebar.
const libraries = [
  { name: 'Liked Soxngs', songCount: 5123, image: "/public/uifaces-popular-image (1).jpg" }, // Danh sách bài hát đã thích.
  { name: 'Heavy Metal', songCount: 1643 }, // Playlist Heavy Metal.
  { name: 'Jazz', songCount: 64 }, // Playlist Jazz.
  { name: 'Funk', songCount: 89 }, // Playlist Funk.
  { name: 'Soul', songCount: 59 }, // Playlist Soul.
  { name: 'Classic Rock', songCount: 113 }, // Playlist Classic Rock.
  { name: 'Progressive Rock', songCount: 34 }, // Playlist Progressive Rock.
  { name: 'Death Metal', songCount: 120 }, // Playlist Death Metal.
  { name: 'Fusion Jazz', songCount: 20 }, // Playlist Fusion Jazz.
  { name: 'Neo-Soul', songCount: 36 }, // Playlist Neo-Soul.
  { name: 'Black Metal', songCount: 76 }, // Playlist Black Metal.
  { name: 'R&B', songCount: 12 }, // Playlist R&B.
  { name: 'Indie Rock', songCount: 16 }, // Playlist Indie Rock.
]

// Gọi hàm `getIconSize` để lấy kích thước icon lớn (`'l'`) và lưu vào `iconProperties`.
const iconProperties = getIconSize('l', true)

// Định nghĩa component `SidebarLibraryExplorer`, hiển thị thư viện nhạc trong sidebar.
export default function SidebarLibraryExplorer() {
  return (
    // Container chính của sidebar với các thuộc tính kiểu dáng.
    <div className="flex w-full flex-col items-center gap-4 overflow-hidden rounded-lg bg-s-gray-darkest pt-4 text-white">

      {/* Phần hiển thị icon thư viện với tooltip */}
      <div>
        <TooltipWrapper side="right" tooltipContent="Expand Your Library">
          <LibraryBig
            className="text-s-gray-lighter transition-colors duration-300 hover:text-white"
            {...iconProperties} // Truyền kích thước icon.
          />
        </TooltipWrapper>
      </div>

      {/* Khu vực hiển thị danh sách thư viện, có hỗ trợ cuộn khi danh sách dài */}
      <ScrollArea className="flex scroll-pt-2 flex-col overflow-hidden">
        {/* Duyệt danh sách `libraries` và render mỗi thư viện bằng `LibraryCard` */}
        {libraries.map((library) => (
          <LibraryCard
            isPinned={false} // Mặc định thư viện chưa được ghim.
            key={library.name} // Sử dụng `name` làm key để tránh lỗi React.
            library={library} // Truyền dữ liệu thư viện vào `LibraryCard`.
          />
        ))}
      </ScrollArea>
    </div>
  )
}
