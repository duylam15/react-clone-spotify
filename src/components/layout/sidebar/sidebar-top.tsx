import { HomeIcon, LibraryBig, SearchIcon } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import IconLink from "./icon-link";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import getIconSize from "@/utils/get-icon-size";

export default function SidebarTop() {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [playlistName, setPlaylistName] = useState<string>("");
  const [playlistDescription, setPlaylistDescription] = useState<string>("");
  const [playlistImage, setPlaylistImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  async function addPlaylist() {
    if (!playlistName.trim()) {
      alert("Vui lòng nhập tên danh sách phát!");
      return;
    }

    let imageUrl = "http://localhost:5173/public/uifaces-popular-image%20(3).jpg"; // Ảnh mặc định nếu không có ảnh tải lên

    if (playlistImage) {
      const formData = new FormData();
      formData.append("file", playlistImage);
    }

    const newPlaylist = {
      nguoi_dung_id: 1,
      ten_danh_sach: playlistName,
      mo_ta: playlistDescription || "Danh sách phát mới.",
      la_cong_khai: true,
      ngay_tao: new Date().toISOString(),
      tong_thoi_luong: 0,
      so_thu_tu: 1,
      anh_danh_sach: imagePreview,
      so_nguoi_theo_doi: 0,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/danhsachphat/them/", newPlaylist, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Thêm danh sách phát thành công:", response.data);
      setPlaylistName("");
      setPlaylistDescription("");
      setPlaylistImage(null);
      setImagePreview("");
      setShowInput(false);
    } catch (error) {
      console.error("Lỗi khi thêm danh sách phát:", error);
    }
  }



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
    <div className="flex w-full flex-col items-start ml-4 justify-center gap-6 rounded-lg bg-s-gray-darkest py-4 text-white">
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
            <button onClick={addPlaylist} className="bg-green-500 text-white px-3 py-1 rounded">
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
