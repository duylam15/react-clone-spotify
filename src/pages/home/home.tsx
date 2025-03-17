// Import kiểu `Playlist` từ file `@/types`.
// `Playlist` có thể là một interface hoặc type định nghĩa cấu trúc của playlist.
import { Playlist } from '@/types/types'
import { Song } from '@/types/types'

// Import component `PlaylistCardsContainer` từ file `playlist-cards-container`.
// Đây là component dùng để hiển thị danh sách playlist dưới dạng thẻ.
import PlaylistCardsContainer from './playlist-cards-container'
import { useEffect, useState } from 'react'
import { convertPlaylistFromBackend, getPlayList } from '@/services/playlistAPI'

import axios from "axios"

// Khai báo một danh sách `Playlists` có kiểu `Playlist[]` (mảng các playlist).

// Định nghĩa component `Home` là một React component.
// Component này trả về giao diện chứa danh sách các playlist.
export default function Home(): React.ReactNode {
  // const [playlists, setPlayLists] = useState<Playlist[]>(Playlists)

  const [danhSachPhat, setDanhSachPhat] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDanhSachPhat = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/danhsachphat/")
        setDanhSachPhat(response.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDanhSachPhat()
  }, [])

  console.log("danhSachPhatdanhSachPhatdanhSachPhatdanhSachPhatdanhSachPhat", danhSachPhat)

  return (
    // Một div cha có class `flex flex-col px-3`, giúp các phần tử con hiển thị theo chiều dọc (cột) và có padding ngang.
    <div className="flex flex-col px-3">
      {/* Gọi component `PlaylistCardsContainer` để hiển thị các playlist theo danh sách có tiêu đề */}
      <PlaylistCardsContainer title="First Playlist Bundle" items={danhSachPhat} />
      <PlaylistCardsContainer title="Second Playlist Bundle" items={danhSachPhat} />
      <PlaylistCardsContainer title="Third Playlist Bundle" items={danhSachPhat} />
      <PlaylistCardsContainer title="Fourth Playlist Bundle" items={danhSachPhat} />
      <PlaylistCardsContainer title="Fifth Playlist Bundle" items={danhSachPhat} />
    </div>
  )
}
