// Import các icon biểu tượng âm lượng từ thư viện 'lucide-react'
import { Volume1Icon, Volume2Icon, VolumeIcon, VolumeXIcon } from 'lucide-react';

// Import các hooks cần thiết từ React
import { useCallback, useMemo, useState } from 'react';

// Import component ControlButton (nút điều khiển) từ thư mục components/ui
import ControlButton from '@/components/ui/control-button';

// Import Slider (thanh trượt chỉnh âm lượng) từ thư mục components/ui
import { Slider } from '@/components/ui/slider';

// Định nghĩa và xuất component VolumeController
export default function VolumeController(): React.ReactNode {
  // State quản lý mức âm lượng, mặc định là 0.5 (50%)
  const [volume, setVolume] = useState<number>(0.5);

  // State kiểm tra xem âm thanh có bị tắt tiếng không, mặc định là false (không tắt)
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Lấy phần tử audio từ DOM (thẻ có id="audio-player")
  const audioPlayer = document.querySelector<HTMLAudioElement>('#audio-player');

  // Tính toán giá trị mặc định cho thanh trượt âm lượng (lưu trữ dưới dạng mảng)
  const defaultVolume = useMemo(() => [volume * 100], [volume]);

  // Xác định giá trị hiện tại của thanh trượt âm lượng, nếu isMuted thì giá trị là 0
  const volumeValue = useMemo(() => [isMuted ? 0 : volume * 100], [isMuted, volume]);

  // Hàm xử lý khi thay đổi giá trị thanh trượt âm lượng
  const onValueChange = useCallback(
    (value: number[]) => {
      // Nếu không có giá trị hoặc không tìm thấy audioPlayer thì thoát
      if (value[0] === undefined || !audioPlayer) return;

      // Cập nhật state volume theo giá trị mới của thanh trượt
      setVolume(value[0] / 100);

      // Cập nhật âm lượng của audioPlayer
      audioPlayer.volume = value[0] / 100;
    },
    [audioPlayer], // useCallback sẽ chỉ tạo lại hàm khi audioPlayer thay đổi
  );

  // Hàm xử lý khi bấm vào nút tắt/mở âm lượng
  const onMuteClick = useCallback(() => {
    // Nếu không tìm thấy audioPlayer thì thoát
    if (!audioPlayer) return;

    // Cập nhật trạng thái tắt/mở âm thanh
    setIsMuted((previous) => !previous);

    // Cập nhật thuộc tính muted của audioPlayer
    audioPlayer.muted = !isMuted;
  }, [audioPlayer, isMuted]); // useCallback sẽ chỉ tạo lại hàm khi audioPlayer hoặc isMuted thay đổi

  return (
    <div className="group flex w-32 flex-row items-center">
      {/* Nút điều khiển âm lượng, thay đổi icon theo mức âm lượng */}
      <ControlButton
        Icon={
          isMuted || volume === 0 // Nếu âm lượng bị tắt hoặc bằng 0 thì hiển thị icon VolumeXIcon
            ? VolumeXIcon
            : volume < 0.3 // Nếu âm lượng nhỏ hơn 30% thì hiển thị icon VolumeIcon
              ? VolumeIcon
              : volume < 0.6 // Nếu âm lượng nhỏ hơn 60% thì hiển thị icon Volume1Icon
                ? Volume1Icon
                : Volume2Icon // Nếu âm lượng từ 60% trở lên thì hiển thị icon Volume2Icon
        }
        className="text-s-gray-lighter group-hover:text-s-gray-lightest" // Áp dụng style khi hover
        onClick={onMuteClick} // Gán sự kiện click để tắt/mở âm lượng
        tooltipText="Mute" // Tooltip hiển thị "Mute"
      />

      {/* Thanh trượt điều chỉnh âm lượng */}
      <Slider
        className="col-span-3" // Áp dụng style lưới CSS
        defaultValue={defaultVolume} // Giá trị mặc định của thanh trượt
        max={100} // Giá trị tối đa của thanh trượt là 100 (100%)
        min={0} // Giá trị tối thiểu của thanh trượt là 0 (tắt tiếng)
        onValueChange={onValueChange} // Gán sự kiện thay đổi giá trị thanh trượt
        step={1} // Giá trị thay đổi tối thiểu khi kéo thanh trượt là 1
        value={volumeValue} // Giá trị hiện tại của thanh trượt
      />
    </div>
  );
}

// Tổng kết:
// Component này quản lý âm lượng của trình phát nhạc với nút tắt / mở âm thanh và thanh trượt điều chỉnh âm lượng.
// Sử dụng useState để quản lý trạng thái âm lượng và tắt / mở âm thanh.
// Sử dụng useMemo để tối ưu hóa tính toán giá trị thanh trượt.
// Sử dụng useCallback để tối ưu hóa các hàm xử lý sự kiện.
// Thay đổi biểu tượng nút điều khiển tùy theo mức âm lượng hiện tại.