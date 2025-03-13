/* eslint-disable jsx-a11y/media-has-caption */
// Tắt cảnh báo của ESLint về việc thiếu phụ đề trong phần tử <audio>.

// Import các component con trong phần footer.
import React, { useEffect, useState } from 'react'
import { Song } from '@/types/types'
import TrackDisplayer from './footer/track-displayer' // Hiển thị thông tin bài hát đang phát
import PlayerController from './footer/player-controller' // Bộ điều khiển chính
import OtherControls from './footer/other-controls' // Các điều khiển khác như âm lượng, chế độ phát nhạc, v.v.

interface FooterProps {
  currentSong: Song | null
}

const Footer: React.FC<FooterProps> = ({ currentSong }) => {
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null)


  useEffect(() => {
    if (audioPlayer && currentSong) {
      audioPlayer.src = currentSong.duong_dan
      audioPlayer.play() // Play the song when it's updated
    }
  }, [currentSong, audioPlayer])

  return (
    <div className="flex flex-row items-center justify-between p-2 pb-3">
      {/* Hiển thị thông tin bài hát (tên, ảnh bìa, nghệ sĩ, v.v.) */}
      <TrackDisplayer song={currentSong} />

      {/* Điều khiển phát nhạc (play, pause, next, previous) */}
      <PlayerController />

      {/* Các nút điều khiển bổ sung (âm lượng, lặp lại, shuffle, v.v.) */}
      <OtherControls />

      {/* Thẻ audio để phát nhạc, nguồn được thay đổi khi người dùng chọn bài hát */}
      <audio
        id="audio-player"
        preload="auto"
        hidden
        ref={(audio) => setAudioPlayer(audio)}
      />
    </div>
  )
}

export default Footer
