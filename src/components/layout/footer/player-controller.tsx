// Import hook `useState` từ React để quản lý trạng thái của thời gian hiện tại trong trình phát nhạc
import { useState } from 'react'

// Import các thành phần con của trình phát nhạc
import ButtonGroup from './player-controller/button-group' // Nhóm các nút điều khiển nhạc (phát, tạm dừng, chuyển bài,...)
import ControllerSlider from './player-controller/controller-slider' // Thanh trượt để điều chỉnh tiến trình phát nhạc
import TimeDisplay from './player-controller/time-display' // Hiển thị thời gian của bài hát

// Định nghĩa component `PlayerController`, trả về một React Node
export default function PlayerController(): React.ReactNode {
  // State lưu trữ thời gian hiện tại của bài hát (tính theo giây)
  const [currentTime, setCurrentTime] = useState<number>(0)

  // Lấy phần tử audio từ DOM bằng cách truy vấn theo `id="audio-player"`
  const audioPlayer = document.querySelector<HTMLAudioElement>('#audio-player')

  // Lắng nghe sự kiện "timeupdate" trên trình phát nhạc, cập nhật `currentTime` mỗi giây
  audioPlayer?.addEventListener('timeupdate', () => {
    setTimeout(() => setCurrentTime(audioPlayer.currentTime), 1000)
  })

  // Lấy tổng thời gian của bài hát, nếu `audioPlayer` không tồn tại thì giá trị mặc định là 0
  const duration = audioPlayer?.duration ?? 0

  return (
    // Container chính cho trình phát nhạc
    <div className="flex w-full max-w-[35vw] flex-col items-center gap-1">
      {/* Nhóm các nút điều khiển (Play, Pause, Next, Previous) */}
      <ButtonGroup />

      {/* Dòng hiển thị thanh trượt tiến trình bài hát */}
      <div className="flex w-full flex-row items-center gap-2 text-s-gray-light">
        {/* Hiển thị thời gian hiện tại của bài hát */}
        <TimeDisplay totalSeconds={currentTime} />
        {/* Thanh trượt để điều chỉnh thời gian phát */}
        <ControllerSlider />
        {/* Hiển thị tổng thời gian của bài hát */}
        <TimeDisplay totalSeconds={duration} />
      </div>
    </div>
  )
}

// Ví dụ về cách hoạt động
// Giả sử bài hát dài 3 phút(180 giây), khi người dùng nghe nhạc:

// currentTime tăng lên từng giây từ 0 → 180.
// ControllerSlider thay đổi dựa trên currentTime.
// TimeDisplay cập nhật và hiển thị thời gian.
// Nếu người dùng kéo thanh trượt, currentTime được cập nhật ngay.