import { HomeIcon, LibraryBig, SearchIcon, Disc, Cloud, Smile, Frown, Zap, Headphones } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import IconLink from "./icon-link";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import ChatButton from "@/components/chat";
import { useRefresh } from "@/contexts/RefreshContext";
import { message, Spin } from "antd";

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
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true); // Bắt đầu loading

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
        setLoading(false);
        refresh()
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      alert("Có lỗi xảy ra, vui lòng thử lại!");
      console.error(error);
    } finally {
      setLoading(false); // Dừng loading
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

  const iconProperties = { size: 26, strokeWidth: 2.5 }


  // tạo album
  const [showAlbumInput, setShowAlbumInput] = useState<boolean>(false);
  const [albumName, setAlbumName] = useState<string>("");
  const [artistName, setArtistName] = useState<string>("");
  const [albumImage, setAlbumImage] = useState<File | null>(null);
  const [albumImagePreview, setAlbumImagePreview] = useState<string>("");
  const [albumGenre, setAlbumGenre] = useState<string>("");
  const [theLoais, setTheLoais] = useState<any[]>([]);
 

  console.error("userId for album creation", userId);
  
 useEffect(() => {
    const fetchTheLoais = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/loaibaihat/`);
        setTheLoais(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thể loại:", error);
      }
    };
    fetchTheLoais();
  }, []);

  const handleAlbumSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!albumName || !albumImage || !albumGenre || !artistName) {
      alert("Vui lòng điền đầy đủ thông tin cho album!");
      return;
    }
  
    const formData = new FormData();
    formData.append("ten_album", albumName);
    formData.append("the_loai", albumGenre);
    formData.append("anh_bia", albumImage); // ✅ Gửi đúng file ảnh
    formData.append("nguoi_dung_id", userId.toString());
    formData.append("ten_nghe_si", artistName);
  
    setLoading(true);
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/album/create/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      alert("Album đã được tạo thành công!");
      setAlbumName("");
      setArtistName("");
      setAlbumImage(null);
      setAlbumImagePreview("");
      setAlbumGenre("");
      setLoading(false);
      refresh();
    }  catch (error: any) {
      const errorMessage = error.response?.data?.error  ;
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAlbumImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAlbumImage(file);
      setAlbumImagePreview(URL.createObjectURL(file));
      console.log("albumImagePreview", albumImagePreview);
    }
  };

  //tạo playlist theo icon cảm xúc
  const [showMood, setShowMood] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null); // Lưu trữ cảm xúc bằng số
  const [moodImage, setMoodImage] = useState<string>(""); // Lưu trữ ảnh đại diện cho playlist
  const [activeMood, setActiveMood] = useState<number | null>(null); // Trạng thái của mood đã chọn

  const moodImages:  { [key: number]: string[] } =  {
    1: ["../.../../../../../public/joy.jpg", "../.../../../../../public/joy2.jpg", "../.../../../../../public/joy3.jpg"],  // Các ảnh cho cảm xúc vui
    2: ["../.../../../../../public/sad1.jpg", "../.../../../../../public/sad2.jpg", "../.../../../../../public/sad3.jpg"],    // Các ảnh cho cảm xúc buồn
    3: ["../.../../../../../public/relax.jpg", "../.../../../../../public/relax2.jpg", "../.../../../../../public/relax3.jpg"],   // Các ảnh cho cảm xúc thư giãn
    4: ["../.../../../../../public/vibrant.jpg", "../.../../../../../public/vibrant2.jpg", "../.../../../../../public/vibrant3.jpg"], // Các ảnh cho cảm xúc sôi động
  };

  const moodStrings: { [key: number]: string } = {
    1: "vui",
    2: "buồn",
    3: "thư giãn",
    4: "sôi động",
  };

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    setActiveMood(mood);
  
    // Lấy ngẫu nhiên một ảnh từ mảng ảnh ứng với cảm xúc
    const images = moodImages[mood];
  
    // Kiểm tra nếu images tồn tại và có ít nhất 1 ảnh
    if (images && images.length > 0) {
      const randomImage = images[Math.floor(Math.random() * images.length)] || "";
      setMoodImage(randomImage);  // Đảm bảo randomImage luôn có giá trị hợp lệ
    } else {
      setMoodImage("");  // Nếu không có ảnh, set một giá trị mặc định (ví dụ: chuỗi rỗng)
      console.error("Không tìm thấy ảnh cho cảm xúc này");
    }
  };
  
  const handleCreatePlaylist = async () => {
    if (selectedMood === null || !moodImage) {
      message.error("Vui lòng chọn cảm xúc!");
      return;
    }
  
    
      // Tải ảnh từ URL và chuyển thành Blob
      const responseImg = await fetch(moodImage);
      const blob = await responseImg.blob();
  
      // Chuyển Blob thành đối tượng File
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });
  
      // Chuyển số cảm xúc thành string
      const moodString = moodStrings[selectedMood] || "";
    console.error("hình ảnh", file);
    
      // Tạo FormData và append các trường vào
      const formData = new FormData();
      formData.append("cam_xuc", moodString);  // Gửi cảm xúc dưới dạng string
      formData.append("nguoi_dung_id", userId.toString());
      formData.append("anh_danh_sach", file);  // Gửi file hình ảnh
  
      setLoading(true);
      try {
      // Gửi FormData qua API
      const response = await axios.post("http://127.0.0.1:8000/danhsachphat/them_theo_cam_xuc/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 201) {
        message.success(`Playlist theo cảm xúc ${moodString} đã được tạo!`);
        refresh(); // Refresh danh sách playlist
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo playlist!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const iconProperty = { size: 30, strokeWidth: 2.5 };
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spin size="large" style={{ color: "green" }} />
        </div>
      )}
      <div className="flex w-full flex-col items-start ml-4 justify-center gap-6 rounded-lg bg-black py-4 text-white">
        <IconLink Icon={HomeIcon} title="Home" to="/" />
        <IconLink Icon={SearchIcon} title="Search" to="/search" />

        {/* Form nhập thông tin danh sách phát */}
        {showInput && (
          <div className="fixed top-20 left-[300px] transform -translate-x-1/2 bg-gray-800 p-4 rounded-lg shadow-lg z-10">
            <h3 className="text-white text-2xl font-semibold mb-4 text-center">Tạo danh sách phát</h3>
            <div className="flex flex-col md:flex-row justify-center items-start gap-6">

              {/* Ảnh preview hoặc input ảnh */}
              <div>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Ảnh danh sách"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                ) : <>
                  <div className="w-40 h-40 object-cover flex justify-center items-center rounded-lg bg-black text-gray-400">Ảnh bìa</div>
                </>
                }

                <div className="flex flex-col items-start mt-4">
                <label
                    htmlFor="upload"
                    className="w-40 h-10 text-white bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition duration-200 flex items-center justify-center"
                  >
                    Chọn ảnh
                  </label>
                  <input
                    id="upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Các input */}
              <div className="flex flex-col gap-4 w-full max-w-[350px]">
                <input
                  type="text"
                  placeholder="Tên danh sách..."
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <textarea
                  placeholder="Mô tả danh sách..."
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none h-24"
                />
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
          </div>
        )}

        {/* Nút mở form nhập thông tin danh sách phát */}
        <div
          onClick={() => setShowInput(!showInput)}
          className="ml-[-2px] cursor-pointer "
        >
          <svg fill="#ababab" height="28px" width="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.00 490.00" stroke="#858585" stroke-width="0.0049"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M227.8,174.1v53.7h-53.7c-9.5,0-17.2,7.7-17.2,17.2s7.7,17.2,17.2,17.2h53.7v53.7c0,9.5,7.7,17.2,17.2,17.2 s17.1-7.7,17.1-17.2v-53.7h53.7c9.5,0,17.2-7.7,17.2-17.2s-7.7-17.2-17.2-17.2h-53.7v-53.7c0-9.5-7.7-17.2-17.1-17.2 S227.8,164.6,227.8,174.1z"></path> <path d="M71.7,71.7C25.5,118,0,179.5,0,245s25.5,127,71.8,173.3C118,464.5,179.6,490,245,490s127-25.5,173.3-71.8 C464.5,372,490,310.4,490,245s-25.5-127-71.8-173.3C372,25.5,310.5,0,245,0C179.6,0,118,25.5,71.7,71.7z M455.7,245 c0,56.3-21.9,109.2-61.7,149s-92.7,61.7-149,61.7S135.8,433.8,96,394s-61.7-92.7-61.7-149S56.2,135.8,96,96s92.7-61.7,149-61.7 S354.2,56.2,394,96S455.7,188.7,455.7,245z"></path> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg>
        </div>


        {/* Form nhập thông tin album */}
        {showAlbumInput && (
          <div className="fixed top-20 left-[300px] transform -translate-x-1/2 bg-gray-800 p-4 rounded-lg shadow-lg z-10">
            <h3 className="text-white text-2xl font-semibold mb-4 text-center">
              Tạo Album
            </h3>
            
            <div className="flex flex-col md:flex-row justify-center items-start gap-6">
              {/* Ảnh preview hoặc input ảnh */}
              <div>
                {albumImagePreview ? (
                  <img
                    src={albumImagePreview}
                    alt="Ảnh album"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-40 h-40 object-cover flex justify-center items-center rounded-lg bg-black text-gray-400">
                    Ảnh bìa album
                  </div>
                )}

                <div className="flex flex-col items-start mt-4">
                  <label
                    htmlFor="upload-album"
                    className="w-40 h-10 text-white bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition duration-200 flex items-center justify-center"
                  >
                    Chọn ảnh
                  </label>
                  <input
                    id="upload-album"
                    type="file"
                    accept="image/*"
                    onChange={handleAlbumImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Các input */}
              <div className="flex flex-col gap-4 w-full max-w-[350px]">
              <div className="flex flex-col gap-1">
          
          <input
            id="artist-name"
            type="text"
            placeholder="Nghệ Danh"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            className="px-4 py-2 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

                <div className="flex flex-col gap-1">
          
                  <input
                    id="album-name"
                    type="text"
                    placeholder="Tên album"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                

                <div className="flex flex-col gap-1">
                  
                <select
  value={albumGenre}
  onChange={(e) => setAlbumGenre(e.target.value)}
  className="px-4 py-2 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
>
  <option value="">Chọn thể loại</option>
  {theLoais.map((tl) => (
    <option key={tl.loai_bai_hat_id} value={tl.ten_loai}>
      {tl.ten_loai}
    </option>
  ))}
</select>

                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowAlbumInput(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAlbumSubmit}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition duration-200"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nút mở form nhập thông tin album với icon Disc */}
        <div
          onClick={() => setShowAlbumInput(!showAlbumInput)}
          className="ml-[-2px] cursor-pointer"
        >
          
          <TooltipWrapper side="right" tooltipContent="Create Album">
            <Disc
              className="text-s-gray-lighter transition-colors duration-300 hover:text-white"
              {...iconProperties}
            />
          </TooltipWrapper>
        </div>


{/* Form nhập thông tin danh sách phát */}
{showMood && (
          <div className="fixed top-20 left-[300px] transform -translate-x-1/2 bg-gray-800 p-4 rounded-lg shadow-lg z-10">
          <h3 className="text-white text-2xl font-semibold mb-4 text-center">
            Bạn muốn nghe nhạc nào
          </h3>
          <div className="flex flex-col md:flex-row justify-center items-start gap-6">
            {/* Icon và label với hiệu ứng shadow khi nhấn */}
            <div
              onClick={() => handleMoodSelect(1)}
              className={`flex flex-col items-center ${activeMood === 1 ? "shadow-lg p-2 rounded-lg" : ""}`}
            >
              <Smile size={iconProperty.size} color="yellow" />
              
              <label className="text-white mt-2">Vui </label>
            </div>
    
            <div
              onClick={() => handleMoodSelect(2)}
              className={`flex flex-col items-center ${activeMood === 2 ? "shadow-lg p-2 rounded-lg" : ""}`}
            >
              <Frown size={iconProperty.size} color="blue" />
              
              <label className="text-white mt-2">Buồn</label>
            </div>
    
            <div
              onClick={() => handleMoodSelect(3)}
              className={`flex flex-col items-center ${activeMood === 3 ? "shadow-lg p-2 rounded-lg" : ""}`}
            >
              <Cloud size={iconProperty.size} color="white" />
              <label className="text-white mt-2">Thư giãn</label>
            </div>
    
            <div
              onClick={() => handleMoodSelect(4)}
              className={`flex flex-col items-center ${activeMood === 4 ? "shadow-lg p-2 rounded-lg" : ""}`}
            >
              <Zap size={iconProperty.size} color="orange" />
              <label className="text-white mt-2">Sôi động</label>
            </div>
          </div>
        
  
          <div className="mt-4 flex justify-between">
          <button
                    onClick={() => setShowMood(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                  >
                    Hủy
                  </button>
            <button
              onClick={handleCreatePlaylist}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400  transition duration-200"
            >
              Tạo Playlist
            </button>
          </div>
        </div>
        
        )}

        {/* Nút mở form nhập thông tin danh sách phát */}
        <div
          onClick={() => setShowMood(!showMood)}
          className="ml-[-2px] cursor-pointer "
        >
          <TooltipWrapper side="right" tooltipContent="Create Emotion Playlist">
            <Headphones
              className="text-s-gray-lighter transition-colors duration-300 hover:text-white"
              {...iconProperties}
            />
          </TooltipWrapper>
          
        </div>
        

        <div className="relative">
          <TooltipWrapper side="right" tooltipContent="Expand Your Library">
            <LibraryBig className="text-s-gray-lighter transition-colors duration-300 hover:text-white" {...iconProperties} />
          </TooltipWrapper>
        </div>
        <ChatButton />
      </div>
    </>
  );
}
