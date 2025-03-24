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

// Danh sách các thư viện nhạc có sẵn trong sidebar.
const libraries = [
  { name: 'Liked Sxxxoxngs', songCount: 5123, image: "/public/uifaces-popular-image (1).jpg" }, // Danh sách bài hát đã thích.
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
  const [playlists, setPlaylists] = useState([])
  const API_BASE_URL = "http://127.0.0.1:8000" // Cấu hình API base URL
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/danhsachphat/nguoidung/1/`)
        setPlaylists(response.data)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
      }
    }
    fetchPlaylist()
  }, [])

  console.log("playlistxxxx", playlists)

  async function addPlaylist(playlistData: object) {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/danhsachphat/them/",
        playlistData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Thêm danh sách phát thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm danh sách phát:", error);
    }
  }

  const newPlaylist = {
    nguoi_dung_id: 1,
    ten_danh_sach: "Nhạc Bxxxxất Hủ",
    mo_ta: "Những bài hát Bolero hay nhất mọi thời đại.",
    la_cong_khai: true,
    ngay_tao: "2025-03-06T10:00:00Z",
    tong_thoi_luong: 4500,
    so_thu_tu: 7,
    anh_danh_sach: "http://localhost:5173/playlist7.jpg",
    so_nguoi_theo_doi: 1200,
  };




  return (
    // Container chính của sidebar với các thuộc tính kiểu dáng.
    <div className="flex w-full flex-col items-start justify-start gap-4 overflow-hidden rounded-lg bg-s-red-darkest pt-4 text-white">
      {/* Phần hiển thị icon thư viện với tooltip */}
      <div onClick={() => { setIsOpen(!isOpen) }} className='relative'>
        <TooltipWrapper side="right" tooltipContent="Expand Your Library">
          <LibraryBig
            className="text-s-gray-lighter transition-colors duration-300 hover:text-white"
            {...iconProperties} // Truyền kích thước icon.
          />
        </TooltipWrapper>
        <div onClick={() => addPlaylist(newPlaylist)} className='p-2 rounded-full border-2 w-8 h-8 border-white flex items-center justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill='white' d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" /></svg>
        </div>
      </div>

      {/* Khu vực hiển thị danh sách thư viện, có hỗ trợ cuộn khi danh sách dài */}
      <ScrollArea className="flex scroll-pt-2 flex-col overflow-hidden">
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
      </ScrollArea>

    </div >
  )
}
