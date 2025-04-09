import { HeartIcon } from 'lucide-react'
import { Album, Artist, Song } from '@/types/types'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import axios from 'axios'

// Định nghĩa component `TrackDisplayer`
type TrackDisplayerProps = {
  song: Song | null // Định nghĩa props song
  artist: Artist;
  artistName: string;
};

export default function TrackDisplayer({ artist, song, artistName }: TrackDisplayerProps) {
  // State `isLiked` lưu trạng thái bài hát có được yêu thích không (mặc định là `false`)
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/album/${song?.album_id}/`)

        console.log("responseresponseresponseresponseresponse", response)
        setAlbum(response.data)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
      }
    }
    fetchAlbum()
  }, [song])

  const currentSong = {
    album: album?.ten_album, // Tên album chứa bài hát
    albumCover: album?.anh_bia, // Ảnh bìa album (sử dụng hình ảnh ngẫu nhiên)
    artist: artistName, // Tên nghệ sĩ
    name: song?.ten_bai_hat, // Tên bài hát
  }

  console.log("currentSongcurrentSongxx", currentSong)

  return (
    <div className="flex min-w-[30vw] flex-row items-center gap-2 lg:min-w-[13vw]">
      {currentSong?.artist && <div className="flex min-w-[30vw] flex-row items-center gap-2 lg:min-w-[13vw]">
        <img
          alt={currentSong.album}
          className="size-14 rounded-md"
          src={currentSong.albumCover}
        />
        <div className="flex flex-col justify-center px-2">
          <h3 className="text-sm font-normal text-s-white">{currentSong.name}</h3>
          <h4 className="text-xs font-normal text-s-gray-lighter">{currentSong.artist}</h4>
        </div>
      </div>}
    </div>
  )
}
