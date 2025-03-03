// Import các hooks từ React
import { useCallback, useEffect, useRef, useState } from 'react';

// Import Slider từ thư mục components/ui
import { Slider } from '@/components/ui/slider';

// Giá trị mặc định của slider, khởi tạo với mảng chứa số 0
const defaultValue = [0];

// Component chính ControllerSlider
export default function ControllerSlider(): React.ReactNode {
  // State để kiểm tra xem slider có đang được kéo hay không
  const [isDragging, setIsDragging] = useState<boolean>(false);
  // State lưu thời gian hiện tại của trình phát nhạc
  const [currentTime, setCurrentTime] = useState<number[]>([0]);

  // Lấy thẻ <audio> với id 'audio-player' từ DOM
  const audioPlayer = document.querySelector<HTMLAudioElement>('#audio-player');
  // Tạo một ref để tham chiếu đến slider
  const sliderReference = useRef<HTMLSpanElement>(null);

  // Lấy tổng thời gian của file âm thanh, nếu không có thì mặc định là 0
  const duration = audioPlayer?.duration ?? 0;

  // Hàm xử lý khi người dùng thả chuột sau khi kéo slider
  const onSliderCommit = useCallback(
    (value: number[]) => {
      // Kiểm tra nếu giá trị không hợp lệ hoặc audioPlayer không tồn tại thì return
      if (value[0] === undefined || !audioPlayer) return;

      // Cập nhật thời gian phát của trình phát nhạc
      audioPlayer.currentTime = value[0];
      // Cập nhật state currentTime
      setCurrentTime(value);
    },
    [audioPlayer], // useCallback phụ thuộc vào audioPlayer
  );

  // useEffect theo dõi sự thay đổi của thời gian hiện tại của audioPlayer
  useEffect(() => {
    // Nếu không có audioPlayer hoặc đang kéo slider thì không cập nhật state
    if (!audioPlayer || isDragging) return;

    // Cập nhật state currentTime theo thời gian hiện tại của audio
    setCurrentTime([audioPlayer.currentTime]);
  }, [isDragging, audioPlayer, audioPlayer?.currentTime, setCurrentTime]);

  // Trả về Slider với các props quan trọng
  return (
    <Slider
      ref={sliderReference} // Gán ref cho slider
      defaultValue={defaultValue} // Giá trị mặc định là 0
      max={duration} // Giá trị tối đa là tổng thời gian bài hát
      min={0} // Giá trị tối thiểu là 0
      onValueChange={(value) => setCurrentTime(value)} // Cập nhật state khi giá trị thay đổi
      onValueCommit={(value) => onSliderCommit(value)} // Gọi hàm xử lý khi người dùng thả slider
      onPointerDown={() => setIsDragging(true)} // Khi bắt đầu kéo, set isDragging = true
      onPointerUp={() => setIsDragging(false)} // Khi thả chuột, set isDragging = false
      step={1} // Giá trị thay đổi mỗi lần kéo là 1 giây
      value={currentTime} // Giá trị hiện tại của slider
    />
  );
}

// Tóm tắt chức năng của ControllerSlider
// Hiển thị thanh trượt để người dùng có thể điều chỉnh thời gian phát nhạc.
// Khi người dùng kéo slider(onPointerDown), trạng thái isDragging được bật để tránh cập nhật currentTime tự động.
// Khi thả slider(onPointerUp), trạng thái isDragging tắt, giá trị mới được cập nhật vào audioPlayer.currentTime.
// Nếu audio đang chạy mà người dùng không kéo slider, giá trị currentTime được cập nhật theo audioPlayer.currentTime.