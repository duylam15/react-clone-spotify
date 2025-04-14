// Import `DotIcon` từ thư viện `lucide-react`.
// `DotIcon` có thể là một icon hình dấu chấm (•), dùng để phân cách các thông tin.
import { useRefresh } from '@/contexts/RefreshContext';
import { updateUser } from '@/services/user';
import { DotIcon, Pencil, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const { refreshTrigger, refresh } = useRefresh();
  const [showForm, setShowForm] = useState(false);
  const [showInput, setShowInput] = useState(false);  // Trạng thái để hiển thị ô input
  const [formData, setFormData] = useState({
    ten_hien_thi: ten_hien_thi,
    email: email,
    gioi_tinh: gioi_tinh,
    ngay_sinh: ngay_sinh,
    avatar_url: avatar_url
  });
  const [errors , setErrors] = useState("");

  useEffect(() => {
    setFormData(
      {
        ten_hien_thi: ten_hien_thi,
        email: email,
        gioi_tinh: gioi_tinh,
        ngay_sinh: ngay_sinh,
        avatar_url: avatar_url
      }
    )
  }, [avatar_url, ten_hien_thi, email, gioi_tinh, ngay_sinh])

  // Hàm xử lý khi có sự thay đổi trong form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý khi người dùng thay đổi URL ảnh đại diện
  const handleAvatarChange = () => {
    setShowInput(true);  // Hiển thị ô input khi nhấp vào ảnh
  };

  // Hàm khi người dùng nhấn Enter hoặc mất focus
  const handleAvatarSubmit = () => {
    setShowInput(false);  // Ẩn ô input sau khi thay đổi
  };

  // Hàm submit thông tin khi người dùng nhấn nút lưu
  const handleSubmit = async () => {
    console.log("Dữ liệu đã được cập nhật:", formData);
    try {
      const response = await updateUser(formData);
      console.log(response);
      if(response.status == 400)
      {
        setErrors(response.response.data.email)
        return 
      }
      setErrors("")
      setShowForm(false);
      refresh();
    } catch (error) {
      console.log(error)
    }
  };

  return (
    // Div chứa toàn bộ phần header của user, sử dụng flexbox để hiển thị theo hàng ngang.
    <div className="flex flex-1 flex-row gap-6 px-4">

      {/* Hiển thị ảnh đại diện của người dùng */}
      <img
        className="size-[180px] rounded-full shadow-[0_0_16px_16px_rgba(0,0,0,0.2)]" // Kích thước 240px, bo tròn, có hiệu ứng bóng đổ.
        src={formData.avatar_url} // Ảnh đại diện của user.
        alt={`${name}'s profile`} // Thuộc tính alt để mô tả ảnh (hữu ích cho SEO và accesssibility).
      />
      {/* Phần chứa thông tin của user */}
      <div className="flex flex-col justify-end gap-6 text-s-white">

        {/* Phần chứa tiêu đề "Profile" và tên user */}
        <div className="flex flex-col justify-end pt-2">
          <h1 className="ps-px text-xl cursor-pointer flex gap-2" onClick={() => { setShowForm(true); console.log(formData.avatar_url) }}>Profile {<Pencil />}</h1> {/* Hiển thị chữ "Profile" với font-size nhỏ */}
          <p className="text-4xl font-bold">{formData.ten_hien_thi}</p> {/* Hiển thị tên user với font lớn */}
        </div>

        {showForm && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-slate-800 p-6 rounded-lg shadow-2xl space-y-4 w-[400px] relative">
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData(
                    {
                      ten_hien_thi: ten_hien_thi,
                      email: email,
                      gioi_tinh: gioi_tinh,
                      ngay_sinh: ngay_sinh,
                      avatar_url: avatar_url
                    }
                  )
                }}
                className="absolute top-2 right-3 text-white text-xl font-bold"
              >
                ✖
              </button>

              <div>
                <label className="block text-sm text-gray-300">Ảnh đại diện:</label>
                {showInput ? (
                  <div>
                    <input
                      type="text"
                      name="avatar_url"
                      value={formData.avatar_url}
                      className="w-full p-2 rounded bg-slate-700 text-white"
                      onChange={handleChange}
                      onBlur={handleAvatarSubmit}  // Khi người dùng mất focus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAvatarSubmit();  // Khi nhấn Enter
                      }}
                    />
                  </div>
                ) : (
                  <img
                    src={formData.avatar_url}
                    className="w-24 h-24 rounded-full mt-4"
                    alt="Avatar preview"
                    onClick={handleAvatarChange}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300">Tên hiển thị:</label>
                <input
                  type="text"
                  name="ten_hien_thi"
                  value={formData.ten_hien_thi}
                  className="w-full p-2 rounded bg-slate-700 text-white"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full p-2 rounded bg-slate-700 text-white"
                  onChange={handleChange}
                />
              </div>
              {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}

              <div>
                <label className="block text-sm text-gray-300">Giới tính:</label>
                <select
                  name="gioi_tinh"
                  value={formData.gioi_tinh}
                  className="w-full p-2 rounded bg-slate-700 text-white"
                  onChange={handleChange}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>


              <div>
                <label className="block text-sm text-gray-300">Ngày sinh:</label>
                <input
                  type="date"
                  name="ngay_sinh"
                  value={formData.ngay_sinh}
                  className="w-full p-2 rounded bg-slate-700 text-white"
                  onChange={handleChange}
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

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
