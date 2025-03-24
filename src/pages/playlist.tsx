import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { Artist, Playlist, Song } from "@/types/types"
import { useNavigate, useParams } from "react-router-dom"
import PlayButton from "@/components/ui/play-button"
import { getSongById, getSongFromPlayList } from "@/services/playlistAPI"
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSong } from "@/stores/playlist/playerSlice"
import { format } from "date-fns";
import { formatThoiLuong } from "@/utils/utils"
import { setReduxSongs } from "@/stores/playlist/songSlice"
import { RootState } from "@/stores/playlist"
import LibraryCard from "@/components/layout/sidebar/library-card/library-card"

const API_BASE_URL = "http://127.0.0.1:8000" // Cấu hình API base URL

export default function PlayList(): React.ReactNode {
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams() // Lấy giá trị của tham số id từ URL
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const playlistId = id ? Number(id) : Number(id)
  const navigate = useNavigate() // Hook điều hướng
  const { currentSong, isPaused } = useSelector((state: RootState) => state.player);

  const audioPlayer: HTMLAudioElement | null = document.querySelector<HTMLAudioElement>('#audio-player');
  // Hàm xử lý sự kiện nhấn nút Play/Pause

  const onClickPlay = useCallback((songs: any) => {
    console.log(songs)
    console.log("aaaaa")
    console.log(songs[0]?.duong_dan)
    const audioPlayer: HTMLAudioElement | null = document.querySelector<HTMLAudioElement>('#audio-player');

    if (!audioPlayer) {
      return
    } // Nếu không tìm thấy phần tử audio thì dừng
    audioPlayer.src = songs[0]?.duong_dan;
    dispatch(setCurrentSong(songs[0]))
    audioPlayer.load();
    audioPlayer.play();
  }, [audioPlayer])



  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/danhsachphat/${id}/`)
        setPlaylist(response.data)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
        setError(err)
      }
    }

    fetchPlaylist()
  }, [])

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);

        // Lấy danh sách bài hát từ playlist
        const data = await getSongFromPlayList(playlistId);
        console.log("Danh sách bài hát trong playlist:", data);

        const songDetails = await Promise.all(
          data.danh_sach_bai_hat.map(async (item: any) => {
            const songId = item.bai_hat;
            const songRes = await getSongById(songId); // Lấy thông tin bài hát
            const artistRes = await axios.get(`http://127.0.0.1:8000/api/nghesi/${songRes.nghe_si}/`);
            const albumRes = await axios.get(`http://127.0.0.1:8000/album/${songRes.album}/`);
            return {
              bai_hat_id: songRes.bai_hat_id,
              ten_bai_hat: songRes.ten_bai_hat,
              the_loai: songRes.the_loai,
              duong_dan: songRes.duong_dan,
              loi_bai_hat: songRes.loi_bai_hat,
              thoi_luong: formatThoiLuong(songRes.thoi_luong),
              ngay_phat_hanh: format(new Date(songRes.ngay_phat_hanh), "MMM dd, yyyy"),
              album_id: albumRes?.data.album_id,
              ten_album: albumRes?.data.ten_album,
              anh_bia: albumRes?.data.anh_bia,
              nghe_si_id: artistRes?.data.nghe_si_id,
              nghe_si: artistRes?.data.ten_nghe_si,
              anh_dai_dien: artistRes?.data.anh_dai_dien,
            };
          })
        );

        setSongs(songDetails);
        dispatch(setReduxSongs(songDetails));

      } catch (err) {
        setError("Không thể tải danh sách bài hát.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [playlistId]);

  console.log("songssongssongssongssongssongs", songs)


  const [artist, setArtist] = useState<Artist>()

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/nghesi/${1}/`)
        console.log("responseresponseresponseresponseresponse", response)
        setArtist(response.data)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
      }
    }

    fetchArtist()
  }, [])

  console.log("artistartistartistartist", artist)

  const [activeSongId, setActiveSongId] = useState<number | null>(null)
  const [clickCount, setClickCount] = useState(0)
  const dispatch = useDispatch();

  console.log("playlistplaylistplaylist", playlist)
  const handleClick = (songId: number, song: Song) => {

    // Kiểm tra xem bài hát được click có phải là bài đang active hay không
    if (activeSongId === songId) {
      // Nếu người dùng đã click vào bài hát này 1 lần trước đó
      console.log("clickCount", clickCount)
      if (clickCount === 1) {
        activeSong(songId) // Gọi hàm phát nhạc
        dispatch(setCurrentSong(song));
        setClickCount(0) // Reset số lần click để chuẩn bị cho lần click mới
      } else {
        setClickCount(1) // Đánh dấu rằng người dùng đã click 1 lần
        // Nếu sau 300ms không có lần click thứ 2, reset clickCount
        setTimeout(() => setClickCount(0), 300)
      }
    } else {
      // Nếu người dùng click vào một bài hát khác, cập nhật bài hát mới
      setActiveSongId(songId)
      // Kiểm tra xem lần click này có phải là lần thứ 2 hay không
      if (clickCount === 1) {
        activeSong(songId) // Nếu là lần thứ 2, phát nhạc luôn
        setClickCount(0) // Reset lại bộ đếm
      } else {
        setClickCount(1) // Nếu là lần đầu, tăng bộ đếm click lên 1
        setTimeout(() => setClickCount(0), 300) // Reset sau 300ms nếu không có click tiếp theo
      }
    }

  }

  const activeSong = (songId: number) => {
    console.log(`Bài hát ID ${songId} đang phát!`)
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleRightClick = (event: React.MouseEvent, bai_hat_id: any) => {
    event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    setIsModalOpen(true);
    setSelectedId(bai_hat_id);
    console.log("📌 ID của item được click:", bai_hat_id);
  };

  const [playlists, setPlaylists] = useState([])
  const API_BASE_URL = "http://127.0.0.1:8000" // Cấu hình API base URL

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/danhsachphat/nguoidung/1/`)
        setPlaylists(response.data)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
      }
    }
    fetchPlaylist()
  }, [])

  console.log("playlistxxxx", playlists)

  const handleAddSongToPlaylist = async (bai_hat_id: any, danh_sach_phat_id: any) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/thembaihatvaodanhsachphat/danhsachphat/them-baihat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bai_hat_id: bai_hat_id,
            danh_sach_phat_id: danh_sach_phat_id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("✅ Bài hát đã được thêm vào danh sách phát!");
      } else {
        alert(`❌ Lỗi: ${data.error || "Không thể thêm bài hát!"}`);
      }
    } catch (error) {
      console.error("Lỗi khi thêm bài hát:", error);
      alert("❌ Lỗi kết nối đến server!");
    }
  };

  if (error) return <div className="text-red-500">Lỗi khi tải danh sách phát</div>
  if (!playlist) return <div className="text-gray-500">Đang tải...</div>

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
          <div onClick={() => onClickPlay(songs)} className="bg-green-500 p-5 inline-block rounded-full hover:bg-green-400 transition">
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
        {songs.map((song: Song) => (
          <div
            key={song?.bai_hat_id}
            onClick={() => handleClick(song?.bai_hat_id, song)}
            onContextMenu={(e) => handleRightClick(e, song?.bai_hat_id)}
            className={`grid grid-cols-[1%_40%_24%_24%_10%] items-center gap-4 text-gray-300 pl-4 ml-6 mr-10 mb-3 pt-1 pb-1 transition rounded-[10px] 
            ${currentSong?.bai_hat_id === song?.bai_hat_id ? "bg-gray-600" : "hover:bg-gray-800"}`}>
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
            <div>{song?.ten_album}</div>
            <div>{song?.ngay_phat_hanh}</div>
            <div>{song?.thoi_luong}</div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-50">
          <div
            className="w-[250px] p-4 bg-white rounded-lg shadow-lg absolute top-[300px] left-[60px]"
          >
            <p className="text-center text-lg font-semibold">thêm danh sách phát</p>
            <div className="flex justify-between items-center flex-col mt-4">
              {playlists?.map((playlist: any) => (
                <div
                  onClick={() => handleAddSongToPlaylist(selectedId, playlist.danh_sach_phat_id)} // Thay 3 bằng ID bài hát động
                  style={{ cursor: "pointer" }}
                >
                  {playlist.ten_danh_sach}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div >


  )
}
