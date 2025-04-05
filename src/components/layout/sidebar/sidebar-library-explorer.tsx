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
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Playlist } from '@/types/types'
import { useNavigate } from 'react-router-dom'
import { useRefresh } from '@/contexts/RefreshContext'

// Danh sách các thư viện nhạc có sẵn trong sideba


// Định nghĩa component `SidebarLibraryExplorer`, hiển thị thư viện nhạc trong sidebar.
export default function SidebarLibraryExplorer() {
  const [playlists, setPlaylists] = useState([])
  const API_BASE_URL = "http://127.0.0.1:8000" // Cấu hình API base URL
  const navigate = useNavigate()
  const { refreshTrigger, refresh } = useRefresh(); // Lấy giá trị từ context
  const userId = Number(localStorage.getItem("idLogin"))

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/danhsachphat/nguoidung/${userId}/`)
        setPlaylists(response.data) // Cập nhật state
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
      }
    }
    fetchPlaylist()
  }, [refreshTrigger]) // 🔥 Chỉ chạy một lần khi component mount

  console.log("playlistsplxxxaylistsplaylists", playlists)

  return (
    // Container chính của sidebar với các thuộc tính kiểu dáng.
    <ScrollArea className="flex scroll-pt-2 flex-col overflow-hidden">

      <div className="flex w-full flex-col items-start justify-start  overflow-hidden rounded-lg bg-s-red-darkest  text-white">
        {/* Khu vực hiển thị danh sách thư viện, có hỗ trợ cuộn khi danh sách dài */}
        {/* Duyệt danh sách `libraries` và render mỗi thư viện bằng `LibraryCard` */}
        {playlists?.map((playlist: any) => (
          <div >
            <LibraryCard
              isPinned={false} // Mặc định thư viện chưa được ghim.
              key={playlist.ten_danh_sach} // Sử dụng `name` làm key để tránh lỗi React.
              playlist={playlist} // Truyền dữ liệu thư viện vào `LibraryCard`.
            />
          </div>
        ))}
      </div >
    </ScrollArea>
  )
}
