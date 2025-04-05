// Import `DotIcon` từ thư viện `lucide-react`.
// `DotIcon` có thể là một icon hình dấu chấm (•), dùng để phân cách các thông tin.
import { DotIcon } from 'lucide-react';

// Định nghĩa interface `UserHeaderProperties` để mô tả các props của component `UserHeader`.
// Các thuộc tính của interface này bao gồm:
// - `image`: URL ảnh đại diện của người dùng.
// - `name`: Tên của người dùng.
// - `playlistCount`: Số lượng playlist công khai của người dùng.
// - `followers`: Số lượng người theo dõi.
// - `following`: Số lượng người mà người dùng này đang theo dõi.
interface UserHeaderProperties {
  avatar_url: string;
  ten_hien_thi: string;
  email: string;
  gioi_tinh: string;
  ngay_sinh: string;
}

// Định nghĩa component `UserHeader` nhận vào các props theo `UserHeaderProperties`.
export default function UserHeader({ avatar_url, ten_hien_thi, email, gioi_tinh, ngay_sinh }: UserHeaderProperties) {
  return (
    // Div chứa toàn bộ phần header của user, sử dụng flexbox để hiển thị theo hàng ngang.
    <div className="flex flex-1 flex-row gap-6 px-4">

      {/* Hiển thị ảnh đại diện của người dùng */}
      <img
        className="size-[240px] rounded-full shadow-[0_0_16px_16px_rgba(0,0,0,0.2)]" // Kích thước 240px, bo tròn, có hiệu ứng bóng đổ.
        src={avatar_url} // Ảnh đại diện của user.
        alt={`${name}'s profile`} // Thuộc tính alt để mô tả ảnh (hữu ích cho SEO và accessibility).
      />

      {/* Phần chứa thông tin của user */}
      <div className="flex flex-col justify-end gap-6 text-s-white">

        {/* Phần chứa tiêu đề "Profile" và tên user */}
        <div className="flex flex-col justify-end pt-2">
          <h1 className="ps-px text-sm">Profile</h1> {/* Hiển thị chữ "Profile" với font-size nhỏ */}
          <h2 className="text-8xl font-bold">{ten_hien_thi}</h2> {/* Hiển thị tên user với font lớn */}
        </div>

        {/* Phần hiển thị số playlist, số follower, số following */}
        <div className="flex flex-row items-end">
          {/* Hiển thị số lượng playlist công khai */}
          {/* <span className="text-s-gray-lighter">{playlistCount} Public Playlists</span>
          <DotIcon className="pb-1" size={14} strokeWidth={4} />

          {followers} Followers

          <DotIcon className="pb-1" size={14} strokeWidth={4} />

          {following} Following */}
        </div>
      </div>
    </div>
  );
}
