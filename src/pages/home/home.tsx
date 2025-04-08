// Import kiểu `Playlist` từ file `@/types`.
// `Playlist` có thể là một interface hoặc type định nghĩa cấu trúc của playlist.
import { Playlist, Album } from '@/types/types'
import { Song } from '@/types/types'

// Import component `PlaylistCardsContainer` từ file `playlist-cards-container`.
// Đây là component dùng để hiển thị danh sách playlist dưới dạng thẻ.
import PlaylistCardsContainer from './playlist-cards-container'
import { useEffect, useState } from 'react'
import { convertPlaylistFromBackend, getPlayList } from '@/services/playlistAPI'

import axios from "axios"
import ChatButton from '@/components/chat'

// Khai báo một danh sách `Playlists` có kiểu `Playlist[]` (mảng các playlist).

// Định nghĩa component `Home` là một React component.
// Component này trả về giao diện chứa danh sách các playlist.
export default function Home(): React.ReactNode {
  // const [playlists, setPlayLists] = useState<Playlist[]>(Playlists)

  const [danhSachPhat, setDanhSachPhat] = useState([])
  const [danhSachAlbum, setDanhSachAlbum] = useState<Playlist[]>([])
  const [danhSachBXH, setDanhSachBXH] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nguoidung, setNguoidung] = useState<any>()
  const userId = Number(localStorage.getItem("idLogin") ?? 0);

  useEffect(() => {
    const fetchDanhSachPhat = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/danhsachphat/nguoidung/${userId}`)
        setDanhSachPhat(response.data)
      } catch (err: any) {
        setError(err.message)
        setDanhSachPhat([])
      } finally {
        setLoading(false)
      }
    }

    fetchDanhSachPhat()
  }, [])
  useEffect(() => {
    const fetchDanhSachAlbum = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/album/`)
        const albums: Album[] = response.data;

        // Map từ Album thành Playlist
        const playlists: Playlist[] = albums.map((album) => ({
          danh_sach_phat_id: null, // Hoặc bạn muốn khác thì chỉnh
          album_id: album.album_id,
          ten_danh_sach: album.ten_album,
          anh_danh_sach: album.anh_bia,
          followers: 0, // Default nếu không có
          description: `Phát hành ngày ${album.ngay_phat_hanh}`, // Bạn tự customize
          order: 0, // Hoặc undefined nếu chưa cần
        }));

        setDanhSachAlbum(playlists)
      } catch (err: any) {
        setError(err.message)
        setDanhSachAlbum([])
      } finally {
        setLoading(false)
      }
    }

    fetchDanhSachAlbum()
  }, [])

  useEffect(() => {
    const fetchDanhSachBXH = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/bxh/api/get_bxh/`)
        setDanhSachBXH(response.data)
      } catch (err: any) {
        setError(err.message)
        setDanhSachPhat([])
      } finally {
        setLoading(false)
      }
    }

    fetchDanhSachBXH()
  }, [])

  useEffect(() => {
    const fetchNguoiDung = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/nguoidung/api/chi-tiet-nguoi-dung/${userId}`)
        setNguoidung(response.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchNguoiDung()
  }, [])

  return (
    <>
      <div className="flex flex-col px-3">
        {/* Gọi component `PlaylistCardsContainer` để hiển thị các playlist theo danh sách có tiêu đề */}
        <PlaylistCardsContainer title={"Bảng xếp hạng"} items={danhSachBXH} />
        <PlaylistCardsContainer title={"Album hot"} items={danhSachAlbum} />
        <PlaylistCardsContainer title={"Made for " + nguoidung?.ten_hien_thi} items={danhSachPhat} />
      </div>
    </>

  )
}
