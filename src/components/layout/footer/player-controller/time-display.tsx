// Import hàm `memo` từ React để tối ưu hóa hiệu suất của component
import { memo } from 'react'

// Định nghĩa component TimeDisplay sử dụng memo để ngăn chặn render lại không cần thiết
const TimeDisplay = memo(({ totalSeconds }: { totalSeconds: number }) => {
  // Tính số phút bằng cách chia tổng số giây cho 60 và làm tròn xuống
  const minutes = Math.floor(totalSeconds / 60)
  // Lấy số giây còn lại sau khi chia hết cho 60
  const seconds = totalSeconds % 60

  // Kiểm tra nếu `totalSeconds` không hợp lệ (NaN), hiển thị '00', ngược lại định dạng số phút với hai chữ số
  const formattedMinutes = Number.isNaN(totalSeconds) ? '00' : String(minutes).padStart(2, '0')
  // Tương tự như trên, định dạng số giây với hai chữ số
  const formattedSeconds = Number.isNaN(totalSeconds) ? '00' : String(Math.round(seconds)).padStart(2, '0')

  // Trả về một thẻ <p> hiển thị thời gian đã định dạng
  return (
    <p className="text-xs text-s-gray-lighter">
      {formattedMinutes}:{formattedSeconds}
    </p>
  )
})

// Đặt display name cho component (giúp debug trong React DevTools)
TimeDisplay.displayName = 'TimeDisplay'

// Xuất component để sử dụng ở nơi khác
export default TimeDisplay

// Giải thích chi tiết về chức năng của TimeDisplay
// Chức năng chính: Hiển thị thời gian dưới dạng MM: SS(phút: giây) dựa trên tổng số giây(totalSeconds).
// Sử dụng memo:
// memo giúp ngăn chặn component render lại nếu giá trị totalSeconds không thay đổi, tối ưu hiệu suất.
// Cách xử lý số phút và giây:
// Số phút(minutes) được tính bằng Math.floor(totalSeconds / 60), tức là lấy phần nguyên.
// Số giây(seconds) được tính bằng totalSeconds % 60, tức là lấy phần dư sau khi chia cho 60.
// Dùng padStart(2, '0') để đảm bảo luôn hiển thị hai chữ số(00:00 thay vì 0: 0).
// Xử lý lỗi(NaN):
// Nếu totalSeconds không hợp lệ(NaN), giá trị hiển thị sẽ mặc định là "00:00" để tránh lỗi giao diện.
