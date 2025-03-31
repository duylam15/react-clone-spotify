// Import `cva` từ thư viện `class-variance-authority` để tạo class CSS động theo biến thể (variants).
import { cva } from 'class-variance-authority'

// Import `useCallback` và `useState` từ React.
import { useCallback, useState } from 'react'

// Import `PlayButton` từ thư mục components/ui, có thể là nút phát nhạc.
import PlayButton from '@/components/ui/play-button'
import { useNavigate } from 'react-router-dom'

// Định nghĩa kiểu dữ liệu `Properties` cho component `ItemCard`.
interface Properties {
  danh_sach_phat_id: number
  anh_danh_sach?: string // Ảnh hiển thị trên card (tùy chọn).
  ten_danh_sach: string // Tiêu đề.
  description?: string // Mô tả (tùy chọn).
  isArtist?: boolean // Có phải nghệ sĩ hay không (tùy chọn).
}

// Định nghĩa class động `imageVariants` để tùy chỉnh style của ảnh.
// Nếu `isArtist` là `true`, ảnh sẽ có viền tròn (`rounded-full`).
// Nếu `isArtist` là `false`, ảnh sẽ có góc bo nhẹ (`rounded-lg`).
const imageVariants = cva('aspect-square w-full object-cover shadow-lg shadow-black/50', {
  variants: {
    isArtist: {
      true: 'rounded-full',
      false: 'rounded-lg',
    },
  },
  defaultVariants: {
    isArtist: false,
  },
})

// Định nghĩa style `truncateStyle` để giới hạn mô tả chỉ hiển thị 2 dòng,
// nếu dài hơn sẽ bị cắt bớt với dấu `...`.
const truncateStyle: React.CSSProperties = {
  WebkitLineClamp: 2, // Giới hạn số dòng hiển thị là 2.
  display: '-webkit-box', // Hiển thị dưới dạng box flex của Webkit.
  WebkitBoxOrient: 'vertical', // Xếp nội dung theo chiều dọc.
  overflow: 'hidden', // Ẩn nội dung vượt quá kích thước box.
  textOverflow: 'ellipsis', // Thêm dấu `...` nếu nội dung bị cắt.
}

// Component `ItemCard` để hiển thị một mục (có thể là album, playlist, nghệ sĩ...).
export default function ItemCard({ danh_sach_phat_id, anh_danh_sach, ten_danh_sach, description, isArtist }: Properties): React.ReactNode {
  // State lưu trữ kích thước ảnh (dùng để tính toán vị trí nút play).
  const [imageSize, setImageSize] = useState<number>(0)

  // `useCallback` tạo một hàm callback tối ưu khi thay đổi kích thước ảnh.
  const imageReference = useCallback(function sizeChangeHandler(node: HTMLImageElement) {
    if (!node) return // Nếu `node` không tồn tại thì không làm gì.

    // Sử dụng `ResizeObserver` để theo dõi sự thay đổi kích thước của ảnh.
    const resizeObserver = new ResizeObserver(() => {
      setImageSize(node.clientWidth) // Cập nhật `imageSize` với chiều rộng của ảnh.
    })

    resizeObserver.observe(node) // Bắt đầu theo dõi ảnh.
  }, [])

  console.log("danh_sach_phat_id", danh_sach_phat_id)
  console.log("anh_danh_sach", anh_danh_sach)

  const navigate = useNavigate()
  const ifSameGoBackElseNavigate = (path: string) => (location.pathname === path ? navigate("/") : navigate(path))
  const openSong = () => ifSameGoBackElseNavigate(`/playlist/${danh_sach_phat_id}`)


  return (
    // Container của card, có hiệu ứng thay đổi màu nền khi hover.
    <div className="group relative flex flex-col rounded-lg bg-transparent p-3 hover:cursor-pointer hover:bg-white/10" onClick={openSong}>
      {/* Ảnh hiển thị với class tùy biến theo `isArtist`. Nếu không có ảnh thì dùng ảnh mặc định */}
      <img
        ref={imageReference} // Gán ref để theo dõi kích thước ảnh.
        className={imageVariants({ isArtist })} // Tạo class động dựa trên `isArtist`.
        src={anh_danh_sach} // Nếu không có ảnh thì dùng ảnh placeholder.
        height={256} // Chiều cao ảnh.
        width={256} // Chiều rộng ảnh.
        alt="playlist" // Văn bản thay thế cho ảnh.
      />

      {/* Nút PlayButton nằm phía trên ảnh, vị trí được tính toán dựa vào kích thước ảnh */}
      <div className="absolute flex size-14 items-center justify-center" style={getButtonPositionStyle(imageSize)}>
        <PlayButton className="translate-y-2 opacity-0 shadow transition-[opacity,transform] duration-200 ease-in group-hover:translate-y-0 group-hover:opacity-100" />
      </div>

      {/* Tiêu đề của card, sử dụng `truncate` để tránh tràn văn bản */}
      <p className="max-w-full truncate pb-2 ps-2 pt-3 leading-none text-white">{ten_danh_sach}</p>

      {/* Nếu có mô tả thì hiển thị với style `truncateStyle`, ngược lại tạo khoảng trắng trống */}
      {description ? (
        <p style={truncateStyle} className="ps-2 text-sm leading-tight text-s-gray-lighter">
          {description}
        </p>
      ) : (
        <div className="h-5"></div> // Thêm khoảng trống nếu không có mô tả.
      )}
    </div>
  )
}

// Hàm `getButtonPositionStyle` tính toán vị trí của nút PlayButton dựa vào kích thước ảnh.
function getButtonPositionStyle(imageSize: number): React.CSSProperties {
  const buttonSizePx = 48 // Kích thước của nút PlayButton.
  return {
    top: `calc(${imageSize}px - ${buttonSizePx - 4}px)`, // Vị trí nút theo chiều dọc (gần góc phải dưới ảnh).
    left: `calc(${imageSize}px - ${buttonSizePx - 4}px)`, // Vị trí nút theo chiều ngang (gần góc phải dưới ảnh).
  }
}
