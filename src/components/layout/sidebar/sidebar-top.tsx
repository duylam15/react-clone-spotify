import { HomeIcon, LibraryBig, SearchIcon } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import IconLink from "./icon-link";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import getIconSize from "@/utils/get-icon-size";

export default function SidebarTop() {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [playlistName, setPlaylistName] = useState<string>("Nhạc Chill");
  const [playlistDescription, setPlaylistDescription] = useState<string>();
  const [playlistImage, setPlaylistImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);  // Trường la_cong_khai
  const [createdAt, setCreatedAt] = useState<string>("2025-04-01T12:00:00Z");  // Trường ngay_tao
  const [totalDuration, setTotalDuration] = useState<number>(0);  // Trường tong_thoi_luong
  const [orderNumber, setOrderNumber] = useState<number>(1);  // Trường so_thu_tu
  const [followersCount, setFollowersCount] = useState<number>(0);  // Trường so_nguoi_theo_doi
  const [userId, setUserId] = useState<number>(1);  // Trường nguoi_dung_id

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Kiểm tra các trường bắt buộc trước khi gửi
    if (!playlistName || !playlistDescription || !playlistImage) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Tạo FormData để gửi lên server
    const formData = new FormData();
    formData.append("ten_danh_sach", playlistName);
    formData.append("mo_ta", playlistDescription);
    formData.append("la_cong_khai", isPublic.toString());  // true or false
    formData.append("ngay_tao", createdAt);  // Định dạng ngày giờ
    formData.append("tong_thoi_luong", totalDuration.toString());
    formData.append("so_thu_tu", orderNumber.toString());
    formData.append("so_nguoi_theo_doi", followersCount.toString());
    formData.append("nguoi_dung_id", userId.toString());  // user ID
    formData.append("anh_danh_sach", playlistImage);  // Ảnh playlist

    try {
      // Gửi dữ liệu lên server
      const response = await axios.post('http://localhost:8000/danhsachphat/them/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Thông báo server là dạng FormData
        },
      });

      // Xử lý nếu thành công
      if (response.status === 201) {
        alert("Danh sách phát đã được thêm thành công!");
        // Reset form nếu cần
        setPlaylistName("");
        setPlaylistDescription("");
        setPlaylistImage(null);
        setImagePreview("");
        setIsPublic(true);
        setCreatedAt("2025-04-01T12:00:00Z");
        setTotalDuration(3600);
        setOrderNumber(1);
        setFollowersCount(100);
        setUserId(5);
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      alert("Có lỗi xảy ra, vui lòng thử lại!");
      console.error(error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPlaylistImage(file);
      setImagePreview(URL.createObjectURL(file));
      console.log("imagePreviewimagePreviewimagePreview", imagePreview)
    }
  };

  const iconProperties = getIconSize("l", true);

  return (
    <div className="flex w-full flex-col items-start ml-4 justify-center gap-6 rounded-lg bg-black py-4 text-white">
      <IconLink Icon={HomeIcon} title="Home" to="/" />
      <IconLink Icon={SearchIcon} title="Search" to="/search" />

      {/* Form nhập thông tin danh sách phát */}
      {showInput && (
        <div className="fixed top-20 left-[250px] transform -translate-x-1/2 bg-gray-800 p-4 rounded-lg shadow-lg z-10">
          <h3 className="text-white mb-2">Tạo danh sách phát</h3>
          <div className="flex justify-center items-center flex-col">
            <input
              type="text"
              placeholder="Tên danh sách..."
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="px-2 py-1 rounded bg-white text-black w-64 mb-2"
            />

            <textarea
              placeholder="Mô tả danh sách..."
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              className="px-2 py-1 rounded bg-white text-black w-64 h-16 mb-2"
            />

            {/* Input file chọn ảnh */}
            <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2 text-white" />
          </div>
          {/* Hiển thị ảnh preview nếu đã chọn */}
          {imagePreview && <img src={imagePreview} alt="Ảnh danh sách" className="w-24 h-24 object-cover rounded-lg mb-2" />}

          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setShowInput(false)} className="bg-gray-500 text-white px-3 py-1 rounded">
              Hủy
            </button>
            <button onClick={handleSubmit} className="bg-green-500 text-white px-3 py-1 rounded">
              Thêm
            </button>
          </div>
        </div>
      )}

      {/* Nút mở form nhập thông tin danh sách phát */}
      <div
        onClick={() => setShowInput(!showInput)}
        className="p-2 rounded-full border-2 w-7 h-7 border-white flex items-center justify-center cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            fill="white"
            d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"
          />
        </svg>
      </div>

      <div className="relative">
        <TooltipWrapper side="right" tooltipContent="Expand Your Library">
          <LibraryBig className="text-s-gray-lighter transition-colors duration-300 hover:text-white" {...iconProperties} />
        </TooltipWrapper>
      </div>
    </div>
  );
}
