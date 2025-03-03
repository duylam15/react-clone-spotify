// Import các icon từ thư viện `lucide-react` để sử dụng trong giao diện điều khiển
import { ListMusicIcon, Mic2Icon, MonitorSpeaker, PlaySquareIcon } from 'lucide-react';
// Import `useNavigate` từ `react-router-dom` để xử lý điều hướng trang
import { useNavigate } from 'react-router-dom';

// Import component `ControlButton` để sử dụng cho các nút điều khiển
import ControlButton from '@/components/ui/control-button';
// Import `useAppControllerStore` để quản lý trạng thái ứng dụng (sử dụng Zustand hoặc một thư viện state management tương tự)
import { useAppControllerStore } from '@/features/appControllerStore';

// Import component điều khiển âm lượng
import VolumeController from './volume-controller';

// Định nghĩa component `OtherControls`
export default function OtherControls(): React.ReactNode {
  // Lấy hàm `toggleDetails` từ `useAppControllerStore`, có thể dùng để mở/đóng chế độ xem chi tiết bài hát
  const toggleDetails = useAppControllerStore((state) => state.toggleDetails);
  // Khởi tạo hook `useNavigate` để xử lý điều hướng trang
  const navigate = useNavigate();

  // Hàm điều hướng: nếu đang ở cùng một đường dẫn thì quay lại trang trước, nếu không thì điều hướng đến đường dẫn mới
  const ifSameGoBackElseNavigate = (path: string) => (location.pathname === path ? navigate(-1) : navigate(path));

  // Hàm mở trang hiển thị lời bài hát (`/lyrics`)
  const openLyrics = () => ifSameGoBackElseNavigate('/lyrics');
  // Hàm mở trang danh sách phát (`/queue`)
  const openQueue = () => ifSameGoBackElseNavigate('/queue');

  return (
    // Hiển thị danh sách nút điều khiển trong một hàng ngang
    <div className="flex w-auto flex-row items-center">
      {/* Nút mở chế độ xem bài hát hiện tại */}
      <ControlButton Icon={PlaySquareIcon} onClick={toggleDetails} tooltipText="Now Playing View" button />
      {/* Nút mở lời bài hát */}
      <ControlButton Icon={Mic2Icon} onClick={openLyrics} tooltipText="Lyrics" button />
      {/* Nút mở danh sách phát */}
      <ControlButton Icon={ListMusicIcon} onClick={openQueue} tooltipText="Queue" button />
      {/* Nút mở chế độ loa ngoài (hiện tại chưa có xử lý, chỉ truyền một hàm rỗng) */}
      <ControlButton Icon={MonitorSpeaker} onClick={() => { }} button />
      {/* Thành phần điều chỉnh âm lượng */}
      <VolumeController />
    </div>
  );
}

// Giải thích chi tiết về chức năng của OtherControls
// Mục đích chính:
// Đây là một nhóm các nút điều khiển bổ sung cho trình phát nhạc, bao gồm:
// Chế độ xem bài hát hiện tại
// Hiển thị lời bài hát
// Hiển thị danh sách phát
// Điều chỉnh âm lượng
// Các thành phần chính:
// toggleDetails: Trạng thái mở hoặc đóng chế độ xem bài hát hiện tại.
//   useNavigate(): Được dùng để điều hướng giữa các trang trong ứng dụng React.
//     ifSameGoBackElseNavigate(path): Nếu đã ở trang path, quay lại trang trước, nếu chưa thì chuyển đến path.
//       openLyrics(): Mở trang / lyrics(hiển thị lời bài hát).
//         openQueue(): Mở trang / queue(hiển thị danh sách phát).
// Hiển thị giao diện:
// Dùng div.flex để căn chỉnh các nút trong một hàng ngang.
// Sử dụng ControlButton với các icon tương ứng.
// tooltipText giúp hiển thị mô tả khi di chuột vào nút.
// VolumeController là thành phần cho phép điều chỉnh âm lượng.
// Ví dụ về cách hoạt động
// Nếu người dùng nhấn vào:
// ✅ Nút "Lyrics" → Điều hướng đến / lyrics, nếu đã ở trang đó thì quay lại trang trước.
// ✅ Nút "Queue" → Điều hướng đến / queue, nếu đã ở trang đó thì quay lại trang trước.
// ✅ Nút "Now Playing View" → Gọi toggleDetails để hiển thị hoặc ẩn chế độ xem bài hát hiện tại.
// ✅ Nút "MonitorSpeaker" → Chưa có chức năng cụ thể(hiện tại truyền một hàm rỗng() => {}).

// Tóm tắt
// ✅ Chức năng: Nhóm các nút điều khiển nhạc như lời bài hát, danh sách phát, chế độ xem bài hát hiện tại, loa ngoài, và âm lượng.
// ✅ Cách hoạt động: Điều hướng giữa các trang bằng useNavigate(), sử dụng Zustand(hoặc state management khác) để quản lý trạng thái.
// ✅ Tối ưu hóa: Sử dụng ifSameGoBackElseNavigate để tránh điều hướng không cần thiết.
// ✅ Dễ mở rộng: Có thể thêm các chức năng như kết nối loa ngoài(MonitorSpeaker).