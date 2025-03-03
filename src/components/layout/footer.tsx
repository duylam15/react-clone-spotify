/* eslint-disable jsx-a11y/media-has-caption */
// Tắt cảnh báo của ESLint về việc thiếu phụ đề trong phần tử <audio>.

// Import các component con trong phần footer.
import OtherControls from './footer/other-controls'; // Các điều khiển khác (ví dụ: âm lượng, chế độ phát nhạc, v.v.).
import PlayerController from './footer/player-controller'; // Bộ điều khiển chính (ví dụ: play, pause, next, prev).
import TrackDisplayer from './footer/track-displayer'; // Hiển thị thông tin bài hát đang phát.

// URL nguồn của file nhạc mẫu.
const source = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

// Định nghĩa component `Footer`, chứa giao diện điều khiển trình phát nhạc.
export default function Footer(): React.ReactNode {
  return (
    // Container chính của footer, căn giữa các thành phần theo hàng ngang và có padding.
    <div className="flex flex-row items-center justify-between p-2 pb-3">

      {/* Hiển thị thông tin bài hát (tên, ảnh bìa, nghệ sĩ, v.v.). */}
      <TrackDisplayer />

      {/* Điều khiển phát nhạc (play, pause, next, previous). */}
      <PlayerController />

      {/* Các nút điều khiển bổ sung (âm lượng, lặp lại, shuffle, v.v.). */}
      <OtherControls />

      {/* Thẻ <audio> để phát nhạc, ẩn đi vì chỉ điều khiển bằng các nút bấm. */}
      <audio id="audio-player" preload="auto" src={source} hidden />
    </div>
  );
}
