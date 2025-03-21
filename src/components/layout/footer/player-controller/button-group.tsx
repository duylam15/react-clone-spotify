// Import các icon từ thư viện lucide-react để sử dụng trong giao diện điều khiển nhạc
import { PauseIcon, PlayIcon, Repeat1Icon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react'

// Import các hooks của React để sử dụng state và callback tối ưu
import { useCallback, useEffect, useState } from 'react'

// Import các component UI tùy chỉnh để sử dụng làm nút điều khiển
import ControlButton from '@/components/ui/control-button'
import ControlSwitch from '@/components/ui/control-switch'

// Import hook để lấy trạng thái và hành động từ store quản lý trình phát nhạc
import { usePlayerControllerStore } from '@/features/playerControllerStore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/stores/playlist'
import { togglePlayPause } from '@/stores/playlist/playerSlice'

// Định nghĩa component ButtonGroup, có nhiệm vụ hiển thị các nút điều khiển nhạc
export default function ButtonGroup(): React.ReactNode {
  // Lấy trạng thái và hành động từ store
  const { isRepeat, isShuffle, toggleRepeat, toggleShuffle } = usePlayerControllerStore((state) => ({
    isRepeat: state.isRepeat, // Trạng thái lặp (one/all/none)
    isShuffle: state.isShuffle, // Trạng thái phát ngẫu nhiên (true/false)
    toggleRepeat: state.toggleRepeat, // Hàm chuyển đổi chế độ lặp
    toggleShuffle: state.toggleShuffle, // Hàm chuyển đổi chế độ ngẫu nhiên
  }))

  // State để kiểm soát trạng thái phát/dừng nhạc
  const dispatch = useDispatch();

  const { currentSong, isPaused } = useSelector((state: RootState) => state.player);
  console.log("isPaused", isPaused)
  const audioPlayer: any = document.querySelector<HTMLAudioElement>('#audio-player')
  console.log("audioPlayeraudioPlayeraudioPlayeraudioPlayer", audioPlayer)
  useEffect(() => {
    if (audioPlayer?.paused) {
      audioPlayer.play();
    }
  }, [currentSong]);
  // Hàm xử lý sự kiện nhấn nút Play/Pause
  const onClickPlay = useCallback(() => {
    if (!audioPlayer) {
      return
    } // Nếu không tìm thấy phần tử audio thì dừng
    console.log("audioPlayeraudioPlayeraudioPlayer", audioPlayer)
    console.log("audioPlayeraudioPlayer", audioPlayer?.paused)
    if (audioPlayer.paused) {
      void audioPlayer.play()
    }// Nếu nhạc đang dừng thì phát
    else void audioPlayer.pause() // Nếu nhạc đang phát thì dừng
    dispatch(togglePlayPause());
  }, [audioPlayer])

  // Gán trực tiếp hàm toggleShuffle vào onShuffle để tối ưu hiệu suất
  const onShuffle = useCallback(toggleShuffle, [toggleShuffle])

  // Gán trực tiếp hàm toggleRepeat vào onRepeat để tối ưu hiệu suất
  const onRepeat = useCallback(toggleRepeat, [toggleRepeat])

  // Hàm xử lý sự kiện khi nhấn nút quay lại bài hát trước
  const onPrevious = useCallback(() => {
    if (!audioPlayer) return // Nếu không tìm thấy phần tử audio thì dừng

    // Đặt lại src của audioPlayer để phát bài hát trước
    audioPlayer.src = 'https://vnso-zn-15-tf-a128-z3.zmdcdn.me/31cb17656c5146f10de0247036f2772d?authen=exp=1742375199~acl=/31cb17656c5146f10de0247036f2772d*~hmac=f404961c1d5ba880c4378c0049517c26'
    audioPlayer.load() // Tải lại bài hát mới
    void audioPlayer.play() // Phát bài hát
  }, [audioPlayer])

  // Hàm xử lý sự kiện khi nhấn nút chuyển sang bài hát tiếp theo
  const onNext = useCallback(() => {
    if (!audioPlayer) return // Nếu không tìm thấy phần tử audio thì dừng

    // Đặt lại src của audioPlayer để phát bài hát tiếp theo
    audioPlayer.src = 'https://vnso-pt-7-tf-a128-z3.zmdcdn.me/6365d747214750e70ab2baf07187b007?authen=exp=1742375416~acl=/6365d747214750e70ab2baf07187b007*~hmac=daa2dd4a00cce6c34571c163d3462e33'
    audioPlayer.load() // Tải lại bài hát mới
    void audioPlayer.play() // Phát bài hát
  }, [audioPlayer])

  // Trả về giao diện điều khiển trình phát nhạc
  return (
    <div className="flex flex-row justify-center gap-3 pb-1">
      {/* Nút bật/tắt phát nhạc ngẫu nhiên */}
      <ControlSwitch Icon={ShuffleIcon} size={17} onClick={onShuffle} switchControl={isShuffle} />

      {/* Nút quay lại bài hát trước */}
      <ControlButton Icon={SkipBackIcon} onClick={onPrevious} button />

      {/* Nút Play/Pause */}
      <ControlButton
        Icon={isPaused ? PlayIcon : PauseIcon} // Hiển thị Play nếu nhạc đang dừng, ngược lại hiển thị Pause
        className="bg-s-gray-lightest text-black transition-transform duration-100 hover:scale-105 active:scale-95"
        onClick={onClickPlay}
      />

      {/* Nút chuyển bài hát tiếp theo */}
      <ControlButton Icon={SkipForwardIcon} onClick={onNext} button />

      {/* Nút bật/tắt chế độ lặp lại */}
      <ControlSwitch
        Icon={isRepeat === 'one' ? Repeat1Icon : RepeatIcon} // Nếu đang lặp một bài thì hiển thị Repeat1Icon, ngược lại hiển thị RepeatIcon
        onClick={onRepeat}
        switchControl={isRepeat === 'one' || isRepeat === 'all'} // Bật nếu chế độ lặp là 'one' hoặc 'all'
      />
    </div>
  )
}


// Tóm tắt chức năng của từng phần:
// Quản lý trạng thái trình phát nhạc

// Sử dụng useState để lưu trạng thái phát / dừng nhạc(isPaused).
// Sử dụng usePlayerControllerStore để lấy trạng thái và thao tác lặp / ngẫu nhiên từ store.
// Lấy phần tử < audio > từ DOM để điều khiển phát nhạc.
// Hàm xử lý sự kiện

// onClickPlay: Dừng hoặc phát nhạc khi nhấn nút.
//   onShuffle: Chuyển đổi chế độ phát ngẫu nhiên.
//     onRepeat: Chuyển đổi chế độ lặp lại.
//       onPrevious: Chuyển về bài hát trước.
//         onNext: Chuyển sang bài hát tiếp theo.
// Giao diện điều khiển

// Gồm các nút phát / dừng, chuyển bài, chế độ phát ngẫu nhiên, chế độ lặp lại.
// Các nút được thiết kế bằng các component UI tùy chỉnh(ControlButton, ControlSwitch).
// 🔥 Tóm lại: Đây là một nhóm nút điều khiển nhạc với tính năng phát / dừng, chuyển bài, lặp lại, phát ngẫu nhiên, sử dụng React hook để quản lý trạng thái và tối ưu hiệu suất. 🚀