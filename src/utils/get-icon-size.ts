// Định nghĩa một interface `IconSize` để mô tả kích thước của icon.
interface IconSize {
  size: number; // Kích thước của icon (theo pixel).
  strokeWidth: number; // Độ dày của đường nét icon.
}

// Hàm `getIconSize` trả về một đối tượng chứa thông tin về kích thước và độ dày nét của icon.
// - `size`: Nhận vào một trong ba giá trị 's' (nhỏ), 'm' (trung bình), 'l' (lớn), mặc định là 'm'.
// - `thin`: Tham số boolean tùy chọn, nếu `true` thì giảm độ dày nét (`strokeWidth`).
export default function getIconSize(size: 's' | 'm' | 'l' = 'm', thin?: boolean): IconSize {
  // Dùng `switch case` để xác định kích thước dựa trên giá trị `size`.
  switch (size) {
    case 's': {
      // Nếu `size` là 's' (nhỏ).
      return { size: 14, strokeWidth: thin ? 2 : 2.5 }; // Trả về kích thước 14px, độ dày nét 2 nếu `thin` là true, ngược lại là 2.5.
    }
    case 'm': {
      // Nếu `size` là 'm' (trung bình).
      return { size: 18, strokeWidth: thin ? 2 : 2.5 }; // Trả về kích thước 18px, độ dày nét 2 nếu `thin` là true, ngược lại là 2.5.
    }
    case 'l': {
      // Nếu `size` là 'l' (lớn).
      return { size: 26, strokeWidth: thin ? 2 : 2.5 }; // Trả về kích thước 26px, độ dày nét 2 nếu `thin` là true, ngược lại là 2.5.
    }
  }
}
