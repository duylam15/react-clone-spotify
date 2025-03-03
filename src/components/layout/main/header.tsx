// Import các icon cần sử dụng từ thư viện `lucide-react`
import { BellIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

// Import `useMemo` từ React để tối ưu hóa hiệu suất tính toán lại giá trị
import { useMemo } from 'react';

// Import `Link` và `useNavigate` từ `react-router-dom` để điều hướng trang
import { Link, useNavigate } from 'react-router-dom';

// Import component TooltipWrapper để hiển thị tooltip khi hover vào các nút
import TooltipWrapper from '@/components/ui/tooltip-wrapper';

// Import custom hook `useAppControllerStore` để lấy dữ liệu `mainWidth` từ state của app
import { useAppControllerStore } from '@/features/appControllerStore';

// Định nghĩa component Header
export default function Header(): React.ReactNode {
  // Sử dụng hook `useNavigate` để điều hướng trang
  const navigate = useNavigate();

  // Lấy giá trị chiều rộng của header từ `useAppControllerStore`
  const width = useAppControllerStore((state) => state.mainWidth);

  // Dùng `useMemo` để tránh render lại không cần thiết khi `width` không thay đổi
  const memoizedWidth = useMemo(() => ({ width }), [width]);

  // Gán username cố định (có thể thay bằng giá trị động trong thực tế)
  const username = 'Emre Can';

  return (
    // Áp dụng width được memoized vào `div`, thiết lập lớp CSS giúp header luôn hiển thị trên cùng
    <div style={memoizedWidth} className="absolute z-10 flex justify-between px-6 py-4">

      {/* Nhóm các nút điều hướng */}
      <div className="flex flex-row items-center gap-2">

        {/* Nút quay lại trang trước */}
        <TooltipWrapper tooltipContent="Go back" side="bottom">
          <button
            className="flex size-8 items-center justify-center rounded-full bg-black/70 text-white"
            onClick={() => navigate(-1)} // Điều hướng về trang trước
          >
            <ChevronLeftIcon className="relative -left-px" strokeWidth={1} size={32} />
          </button>
        </TooltipWrapper>

        {/* Nút đi tới trang tiếp theo */}
        <TooltipWrapper tooltipContent="Go forward" side="bottom">
          <button
            className="flex size-8 items-center justify-center rounded-full bg-black/70 text-white"
            onClick={() => navigate(1)} // Điều hướng đến trang tiếp theo
          >
            <ChevronRightIcon className="relative left-px" strokeWidth={1} size={32} />
          </button>
        </TooltipWrapper>

      </div>

      {/* Nhóm các nút ở góc phải */}
      <div className="flex h-9 flex-row items-center">

        {/* Nút thông báo (What's New) */}
        <TooltipWrapper tooltipContent="What's New" side="bottom">
          <div className="flex size-9 items-center justify-center">
            <button
              className="flex size-8 items-center justify-center rounded-full bg-black/50 text-s-gray-lighter hover:size-9 hover:text-white"
              onClick={() => navigate('/feed')} // Điều hướng đến trang `feed`
            >
              <BellIcon strokeWidth={2} size={18} />
            </button>
          </div>
        </TooltipWrapper>

        {/* Avatar người dùng có tooltip hiển thị tên người dùng */}
        <TooltipWrapper tooltipContent={username} side="bottom">
          <Link to="/user/trknell" className="flex size-9 items-center justify-center">
            <div className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/50 hover:size-[33px] hover:bg-black/70">

              {/* Ảnh đại diện của người dùng */}
              <img
                src="/public/uifaces-popular-image (2).jpg"
                width={24}
                height={24}
                alt="avatar"
                className="size-6 rounded-full"
              />

            </div>
          </Link>
        </TooltipWrapper>

      </div>
    </div>
  );
}


// Tóm tắt chức năng của Header.tsx:
// Hiển thị một thanh header cố định với chiều rộng linh hoạt.
// Có các nút điều hướng:
// Nút quay lại trang trước(ChevronLeftIcon).
// Nút đi tới trang tiếp theo(ChevronRightIcon).
// Nút xem thông báo(BellIcon).
// Avatar người dùng, nhấn vào để chuyển đến trang cá nhân.
// Sử dụng TooltipWrapper để hiển thị tooltip khi di chuột vào các nút.
// Dùng useMemo để tối ưu hiệu suất render.