import { ScrollArea } from '@/components/ui/scroll-area'
import LibraryCard from './library-card/library-card'
import AlbumCard from './library-card/album-card'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRefresh } from '@/contexts/RefreshContext'

// Định nghĩa component `SidebarLibraryExplorer`, hiển thị thư viện nhạc trong sidebar.
export default function SidebarLibraryExplorer() {
  const [playlists, setPlaylists] = useState([])
  const API_BASE_URL = "http://127.0.0.1:8000" // Cấu hình API base URL
  const { refreshTrigger, refresh } = useRefresh(); // Lấy giá trị từ context
  const userId = Number(localStorage.getItem("idLogin") ?? 0);
  console.log("userIduserIduserIdxxxx", userId)

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/danhsachphat/nguoidung/${userId}/`)
        setPlaylists(response.data) // Cập nhật state
        console.log("responsexxx", response)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
        setPlaylists([])
      }
    }
    fetchPlaylist()
  }, [refreshTrigger, userId]) // 🔥 Chỉ chạy một lần khi component mount

  const [albums, setAlbums] = useState([]);

useEffect(() => {
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/album/user/${userId}/`);
      setAlbums(response.data.albums);
    } catch (err) {
      console.error("Error fetching albums:", err);
    }
  };
  fetchAlbums();
}, [refreshTrigger, userId]);


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
              key={playlist.ten_danh_sach} // Sử dụng `name` làm key để tránh lỗi React.
              playlist={playlist} // Truyền dữ liệu thư viện vào `LibraryCard`.
            />
          </div>
        ))}
        {albums?.map((album: any) => (
  <AlbumCard key={album.albumName} album={album} />
        ))}

      </div >
    </ScrollArea>
  )
}
