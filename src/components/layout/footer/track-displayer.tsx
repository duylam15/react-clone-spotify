// Import biểu tượng trái tim từ thư viện `lucide-react` để hiển thị nút "yêu thích"
import { HeartIcon } from 'lucide-react';
import { Song } from '@/types/types';

// Import hook `useState` từ React để quản lý trạng thái
import { useState } from 'react';

// Import các thành phần `Tooltip` từ thư mục `@/components/ui/tooltip` để hiển thị chú thích khi hover
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Import hàm `getIconSize` để lấy kích thước của icon
import getIconSize from '@/utils/get-icon-size';

// Đối tượng `currentSong` chứa thông tin về bài hát hiện tại
const currentSong = {
  album: 'Album Name', // Tên album chứa bài hát
  albumCover: 'https://picsum.photos/200', // Ảnh bìa album (sử dụng hình ảnh ngẫu nhiên)
  artist: 'Artist Name', // Tên nghệ sĩ
  name: 'Song Name', // Tên bài hát
};

// Gọi hàm `getIconSize` với tham số `'l'` để lấy thuộc tính kích thước của icon
const iconProperty = getIconSize('l');

interface TrackDisplayerProps {
  song: Song | null; // Định nghĩa props song
}

// Định nghĩa component `TrackDisplayer`
const TrackDisplayer: React.FC<TrackDisplayerProps> = ({ song }) => {
  if (!song) {
    return <div>Không có bài hát nào được chọn</div>; // Nếu không có bài hát, hiển thị thông báo
  }
  // State `isLiked` lưu trạng thái bài hát có được yêu thích không (mặc định là `false`)
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // State `effects` lưu trạng thái hiệu ứng rung khi người dùng bấm vào biểu tượng trái tim
  const [effects, setEffects] = useState<boolean>(false);

  return (
    // Container chính chứa thông tin bài hát, ảnh bìa, và nút yêu thích
    <div className="flex min-w-[30vw] flex-row items-center gap-2 lg:min-w-[13vw]">
      {/* Hiển thị ảnh bìa album */}
      <img
        alt={`${currentSong.album}'s cover`} // Thuộc tính `alt` giúp tăng khả năng truy cập
        className="size-14 rounded-md" // `size-14`: Kích thước ảnh, `rounded-md`: Bo góc
        src={currentSong.albumCover} // Nguồn ảnh bìa
      />

      {/* Hiển thị thông tin bài hát */}
      <div className="flex flex-col justify-center px-2">
        {/* Hiển thị tên bài hát */}
        <h3 className="text-sm font-normal text-s-white">{currentSong.name}</h3>
        {/* Hiển thị tên nghệ sĩ */}
        <h4 className="text-xs font-normal text-s-gray-lighter">{currentSong.artist}</h4>
      </div>

      {/* Tooltip giúp hiển thị thông báo khi người dùng hover vào biểu tượng trái tim */}
      <Tooltip>
        {/* Nút kích hoạt tooltip (Trigger) */}
        <TooltipTrigger>
          {/* Biểu tượng trái tim để đánh dấu bài hát yêu thích */}
          <HeartIcon
            className={`
              size-4 cursor-default hover:cursor-pointer 
              ${isLiked
                ? 'text-s-green hover:text-s-green-light' // Nếu đã thích, icon có màu xanh
                : 'text-s-gray-lighter hover:text-s-gray-light' // Nếu chưa thích, icon có màu xám
              }
              ${effects ? 'animate-wiggle' : ''} 
            `}
            onAnimationEnd={() => setEffects(false)} // Khi hiệu ứng kết thúc, đặt `effects` về `false`
            onClick={() => {
              setIsLiked(!isLiked); // Đảo ngược trạng thái `isLiked`
              setEffects(true); // Kích hoạt hiệu ứng rung
            }}
            {...iconProperty} // Thêm thuộc tính kích thước của icon
          />
        </TooltipTrigger>

        {/* Nội dung của Tooltip khi hover vào icon trái tim */}
        <TooltipContent className="border-0 bg-s-gray-dark p-1 px-2 text-white" sideOffset={16}>
          Save to Your Library {/* Hiển thị nội dung "Save to Your Library" */}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}


export default TrackDisplayer;

// Cách hoạt động
// Người dùng mở giao diện, thấy ảnh bìa, tên bài hát, tên nghệ sĩ và icon trái tim.
// Khi click vào icon trái tim, trạng thái isLiked thay đổi:
// Nếu chưa thích → chuyển sang thích(icon xanh).
// Nếu đã thích → bỏ thích(icon xám).
// Khi click, icon sẽ có hiệu ứng rung nhẹ(animate - wiggle).
// Khi hover vào icon, tooltip hiển thị "Save to Your Library".