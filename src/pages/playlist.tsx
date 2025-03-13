import { useEffect, useState } from "react";
import axios from "axios";
import { Playlist } from "@/types/types";
import { useNavigate, useParams } from "react-router-dom";
import PlayButton from "@/components/ui/play-button";
import { getSongById, getSongFromPlayList } from "@/services/playlistAPI";

const API_BASE_URL = "http://127.0.0.1:8000"; // Cấu hình API base URL

export default function PlayList(): React.ReactNode {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams(); // Lấy giá trị của tham số id từ URL
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const playlistId = id ? Number(id) : Number(id);
  const navigate = useNavigate(); // Hook điều hướng
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/danhsachphat/${id}/`);
        setPlaylist(response.data);
      } catch (err: any) {
        console.error("Error fetching playlist:", err);
        setError(err);
      }
    };

    fetchPlaylist();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const data = await getSongFromPlayList(playlistId);
        const songIds = data.danh_sach_bai_hat.map((item: any) => item.bai_hat); // Lấy danh sách ID bài hát
        const songDetails = await Promise.all(
          songIds.map(async (songId: number) => {
            const response = await getSongById(songId);
            return response;
          })
        );
        setSongs(songDetails);
      } catch (err) {
        setError("Không thể tải danh sách bài hát.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [playlistId]);


  const [activeSongId, setActiveSongId] = useState<number | null>(null);
  const [clickCount, setClickCount] = useState(0);


  const handleClick = (songId: number) => {
    console.log("activeSongId", activeSongId);
    console.log("songId", songId);

    // Kiểm tra xem bài hát được click có phải là bài đang active hay không
    if (activeSongId === songId) {
      // Nếu người dùng đã click vào bài hát này 1 lần trước đó
      console.log("clickCount", clickCount)
      if (clickCount === 1) {
        activeSong(songId); // Gọi hàm phát nhạc
        setClickCount(0); // Reset số lần click để chuẩn bị cho lần click mới
      } else {
        setClickCount(1); // Đánh dấu rằng người dùng đã click 1 lần
        // Nếu sau 300ms không có lần click thứ 2, reset clickCount
        setTimeout(() => setClickCount(0), 300);
      }
    } else {
      // Nếu người dùng click vào một bài hát khác, cập nhật bài hát mới
      setActiveSongId(songId);
      // Kiểm tra xem lần click này có phải là lần thứ 2 hay không
      if (clickCount === 1) {
        activeSong(songId); // Nếu là lần thứ 2, phát nhạc luôn
        setClickCount(0); // Reset lại bộ đếm
      } else {
        setClickCount(1); // Nếu là lần đầu, tăng bộ đếm click lên 1
        setTimeout(() => setClickCount(0), 300); // Reset sau 300ms nếu không có click tiếp theo
      }
    }

  };

  const activeSong = (songId: number) => {
    console.log(`Bài hát ID ${songId} đang phát!`);
  };


  if (error) return <div className="text-red-500">Lỗi khi tải danh sách phát</div>;
  if (!playlist) return <div className="text-gray-500">Đang tải...</div>;

  return (
    <div className="flex flex-col w-full ">
      <div className="w-[100%]  bg-black-500 p-5 flex justify-start items-center gap-6 rounded-t-[10px]">
        <div className=" ">
          <img className="w-[232px] h-[232px] rounded-lg" src="/public/uifaces-popular-image (2).jpg" alt="" />
        </div>
        <div className="">
          <div className="text-[14px] text-white translate-y-[30px]">Playlist</div>
          <div className="font-black text-[100px] text-white ml-[-4px]">Daily Mix 3</div>
          <div className="text-gray-400 text-[14px]">PAR SG, RPT MCK, Madihu and more</div>
          <div className="text-gray-400 text-[14px]">50 songs, about 2 hr 45 min</div>
        </div>
      </div>
      <div className="w-[100%]  bg-black-500 p-5 rounded-b-[10px] flex justify-between items-center gap-8">
        <div className="flex justify-start items-center gap-8">
          <div className="bg-green-500 p-5 inline-block rounded-full hover:bg-green-400 transition">
            <img className="w-[20px] h-[20px] object-cover" src="/public/play-button-svgrepo-com.svg" alt="" />
          </div>
          <div className="bg-black-500 rounded-full border-[3px] border-gray-300 inline-block">
            <svg className="w-8 h-8 text-gray-300 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
            </svg>
          </div>
          <div className="bg-black-500  inline-block">
            <svg className="w-26 h-26 text-gray-300 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="red" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 12h.01m6 0h.01m5.99 0h.01" />
            </svg>
          </div>
        </div>
        <div>
          <svg className="w-8 h-8 text-gray-300 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-[1%_40%_24%_25%_10%] gap-4  text-gray-300 pl-4 pb-2 ml-6 mr-10 mb-3 mt-5 border-b border-gray-600 ">
        <div className="">#</div>
        <div className="">Title</div>
        <div className="">Album</div>
        <div className="">Date added</div>
        <div className=""><svg className="w-6 h-6 text-gray-300 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        </div>
      </div>
      <div>
        {songs.map((song) => (
          <div
            key={song?.bai_hat_id}
            onClick={() => handleClick(song?.bai_hat_id)}
            className={`grid grid-cols-[1%_40%_24%_24%_10%] items-center gap-4 text-gray-300 pl-4 ml-6 mr-10 mb-3 pt-1 pb-1 transition rounded-[10px] 
            ${activeSongId === song?.bai_hat_id ? "bg-gray-600" : "hover:bg-gray-800"}`}>
            <div>{song?.bai_hat_id}</div>
            <div className="flex items-center gap-2">
              <img className="w-[50px] h-[50px] object-cover rounded-lg" src="/public/uifaces-popular-image (2).jpg" alt="" />
              <div>
                <div className="font-semibold text-white cursor-pointer hover:underline" onClick={() => navigate(`/track/${song?.bai_hat_id}`)} >
                  {song?.ten_bai_hat}
                </div>
                <div>{song?.nghe_si}</div>
              </div>
            </div>
            <div>Album</div>
            <div>{song?.ngay_phat_hanh}</div>
            <div>{song?.thoi_luong}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
