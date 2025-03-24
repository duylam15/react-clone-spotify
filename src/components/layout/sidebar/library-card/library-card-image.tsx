// Import các thành phần từ React
import { CSSProperties, useMemo } from 'react'

// Định nghĩa component `LibraryCardImage` nhận vào một prop `image`
export default function LibraryCardImage({ image }: { image?: string | undefined }) {

  // Sử dụng `useMemo` để tối ưu hiệu suất, chỉ tính toán lại khi `image` thay đổi
  const style = useMemo<CSSProperties>(() => {
    return { backgroundImage: `url(${image})` } // Định nghĩa `backgroundImage` với đường dẫn ảnh
  }, [image])

  // Nếu `image` không được cung cấp (`undefined`), hiển thị một div màu xám (chưa có ảnh)
  return image === undefined ? (
    <div className="size-12 shrink-0 rounded bg-s-green"></div>
  ) : (
    // Nếu có `image`, hiển thị div với ảnh nền
    <div>
      <img src={image} alt="" className="size-12 shrink-0 rounded " />
    </div>
  )
}

// Tóm lại
// ✅ useMemo() giúp tối ưu hóa hiệu suất khi cập nhật ảnh.
// ✅ Điều kiện hiển thị ảnh giúp xử lý trường hợp có hoặc không có ảnh một cách linh hoạt.
// ✅ Sử dụng class size-12 và bg - s - gray để đảm bảo giao diện nhất quán.