import { forwardRef, Ref } from 'react'
// Import `forwardRef` và `Ref` từ React để chuyển tiếp ref xuống phần tử con.

import SidebarLibraryExplorer from './sidebar/sidebar-library-explorer'
// Import component SidebarLibraryExplorer (hiển thị danh sách thư viện nhạc).

import SidebarTop from './sidebar/sidebar-top'
// Import component SidebarTop (hiển thị các biểu tượng điều hướng như Home, Search).

// Định nghĩa component Sidebar và sử dụng `forwardRef` để có thể truyền ref từ component cha xuống.
const Sidebar = forwardRef<HTMLDivElement, unknown>(function Sidebar(
  _properties, // Tham số `_properties` nhưng không sử dụng, vì Sidebar hiện không nhận props.
  reference: Ref<HTMLDivElement>, // `reference` là ref được truyền từ component cha vào.
): React.ReactNode {
  return (
    // Container chính của Sidebar, thiết lập `ref` và sử dụng các class Tailwind để căn chỉnh layout.
    <div ref={reference} className="flex max-h-full w-full flex-col gap-2">

      {/* Phần trên của Sidebar (chứa các biểu tượng như Home, Search). */}
      <SidebarTop />
      {/* Phần dưới của Sidebar (chứa danh sách thư viện nhạc). */}
      <SidebarLibraryExplorer />
    </div>
  )
})

// Đặt tên hiển thị cho component `Sidebar` (hữu ích khi debug trong React DevTools).
Sidebar.displayName = 'Sidebar'

// Xuất component `Sidebar` để sử dụng ở nơi khác trong ứng dụng.
export default Sidebar
