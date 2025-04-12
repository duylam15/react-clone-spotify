import { useState } from 'react'
import ButtonGroup from './player-controller/button-group'
import ControllerSlider from './player-controller/controller-slider'
import TimeDisplay from './player-controller/time-display'

export default function PlayerController(): React.ReactNode {
  const [currentTime, setCurrentTime] = useState<number>(0)
  const audioPlayer = document.querySelector<HTMLAudioElement>('#audio-player')
  audioPlayer?.addEventListener('timeupdate', () => {
    setTimeout(() => setCurrentTime(audioPlayer.currentTime), 1000)
  })
  const duration = audioPlayer?.duration ?? 0

  return (
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
