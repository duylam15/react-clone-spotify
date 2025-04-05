import { HomeIcon, LibraryBig, SearchIcon } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import IconLink from "./icon-link";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import getIconSize from "@/utils/get-icon-size";
import ChatButton from "@/components/chat";
import { useRefresh } from "@/contexts/RefreshContext";

export default function SidebarTop() {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [playlistName, setPlaylistName] = useState<string>("");
  const [playlistDescription, setPlaylistDescription] = useState<string>();
  const [playlistImage, setPlaylistImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);  // Trường la_cong_khai
  const [createdAt, setCreatedAt] = useState<string>(() => {
    // Lấy ngày hiện tại dưới dạng ISO string
    return new Date().toISOString();
  });
  const [totalDuration, setTotalDuration] = useState<number>(0);  // Trường tong_thoi_luong
  const [orderNumber, setOrderNumber] = useState<number>(1);  // Trường so_thu_tu
  const [followersCount, setFollowersCount] = useState<number>(0);  // Trường so_nguoi_theo_doi
  const userId = Number(localStorage.getItem("idLogin"))
  const { refreshTrigger, refresh } = useRefresh(); // Lấy giá trị từ context

  console.log("userIduserIduserIduserId", userId)
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
    if (userId) {
      formData.append("nguoi_dung_id", userId.toString());
    }
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
        refresh()
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

          <h3 className="text-white text-2xl font-semibold mb-4 text-center">Tạo danh sách phát</h3>

          <div className="flex flex-col items-center gap-4">
            {/* Input tên danh sách */}
            <input
              type="text"
              placeholder="Tên danh sách..."
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white text-black w-full max-w-[300px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Input mô tả danh sách */}
            <textarea
              placeholder="Mô tả danh sách..."
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white text-black w-full max-w-[300px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500  resize-none"
            />

            {/* Input file chọn ảnh */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className=" text-white bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition duration-200"
            />

            {/* Hiển thị ảnh preview nếu có */}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Ảnh danh sách"
                className="w-24 h-24 object-cover rounded-lg mx-auto"
              />
            )}

            {/* Các nút "Hủy" và "Thêm" */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowInput(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition duration-200"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nút mở form nhập thông tin danh sách phát */}
      <div
        onClick={() => setShowInput(!showInput)}
        className="ml-[-2px] cursor-pointer "
      >
        <svg fill="#ababab" height="28px" width="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.00 490.00" stroke="#858585" stroke-width="0.0049"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M227.8,174.1v53.7h-53.7c-9.5,0-17.2,7.7-17.2,17.2s7.7,17.2,17.2,17.2h53.7v53.7c0,9.5,7.7,17.2,17.2,17.2 s17.1-7.7,17.1-17.2v-53.7h53.7c9.5,0,17.2-7.7,17.2-17.2s-7.7-17.2-17.2-17.2h-53.7v-53.7c0-9.5-7.7-17.2-17.1-17.2 S227.8,164.6,227.8,174.1z"></path> <path d="M71.7,71.7C25.5,118,0,179.5,0,245s25.5,127,71.8,173.3C118,464.5,179.6,490,245,490s127-25.5,173.3-71.8 C464.5,372,490,310.4,490,245s-25.5-127-71.8-173.3C372,25.5,310.5,0,245,0C179.6,0,118,25.5,71.7,71.7z M455.7,245 c0,56.3-21.9,109.2-61.7,149s-92.7,61.7-149,61.7S135.8,433.8,96,394s-61.7-92.7-61.7-149S56.2,135.8,96,96s92.7-61.7,149-61.7 S354.2,56.2,394,96S455.7,188.7,455.7,245z"></path> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg>
      </div>

      <div className="relative">
        <TooltipWrapper side="right" tooltipContent="Expand Your Library">
          <LibraryBig className="text-s-gray-lighter transition-colors duration-300 hover:text-white" {...iconProperties} />
        </TooltipWrapper>
      </div>
      <ChatButton />
    </div>
  );
}
