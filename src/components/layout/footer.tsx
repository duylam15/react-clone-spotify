/* eslint-disable jsx-a11y/media-has-caption */
// Tắt cảnh báo của ESLint về việc thiếu phụ đề trong phần tử <audio>.

// Import các component con trong phần footer.
import { useDispatch, useSelector } from 'react-redux';
import OtherControls from './footer/other-controls'; // Các điều khiển khác (ví dụ: âm lượng, chế độ phát nhạc, v.v.).
import PlayerController from './footer/player-controller'; // Bộ điều khiển chính (ví dụ: play, pause, next, prev).
import TrackDisplayer from './footer/track-displayer'; // Hiển thị thông tin bài hát đang phát.
import { RootState } from '@/stores/playlist';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Artist } from '@/types/types';


// URL nguồn của file nhạc mẫu.


// Định nghĩa component `Footer`, chứa giao diện điều khiển trình phát nhạc.
export default function Footer(): React.ReactNode {
  const currentSong: any = useSelector((state: RootState) => state?.player?.currentSong);
  console.log("currentSongcurrentSongcurrentSongcurrentSongcurrentSong", currentSong)
  const [artist, setArtist] = useState<Artist>(currentSong?.nghe_si_id)
  const artistName = currentSong?.nghe_si
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/nghesi/${currentSong?.nghe_si_id}`)
        setArtist(response.data)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
      }
    }
    fetchArtist()
  }, [])

  console.log("artistartistarxxxtistartist", artist)


  return (
    // Container chính của footer, căn giữa các thành phần theo hàng ngang và có padding.
    <div className="flex flex-row items-center justify-between p-2 pb-3">

      {/* Hiển thị thông tin bài hát (tên, ảnh bìa, nghệ sĩ, v.v.). */}
      <TrackDisplayer song={currentSong} artist={artist} artistName={artistName} />

      {/* Điều khiển phát nhạc (play, pause, next, previous). */}
      <PlayerController />

      {/* Các nút điều khiển bổ sung (âm lượng, lặp lại, shuffle, v.v.). */}
      <OtherControls />

      {/* Thẻ <audio> để phát nhạc, ẩn đi vì chỉ điều khiển bằng các nút bấm. */}
      <audio id="audio-player" preload="auto" src={currentSong?.duong_dan} hidden />
    </div>
  );
}