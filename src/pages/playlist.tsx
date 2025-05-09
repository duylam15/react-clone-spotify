import { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import { Artist, Playlist, Song } from "@/types/types"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { getSongById, getSongFromPlayList, getSongAlbum, getSongBXH } from "@/services/playlistAPI"
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSong } from "@/stores/playlist/playerSlice"
import { format, formatDuration } from "date-fns";
import { formatSecondsToTime, formatThoiLuong } from "@/utils/utils"
import { setReduxSongs } from "@/stores/playlist/songSlice"
import { RootState } from "@/stores/playlist"
import LibraryCard from "@/components/layout/sidebar/library-card/library-card"
import { useAppControllerStore } from "@/features/appControllerStore"
import { getUserInfo, handleUnauthorized } from '@/services/user';
import { useRefresh } from "@/contexts/RefreshContext"


import { Button, Modal, Form, Input, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { addBaiHat } from "@/services/songAPI";

const API_BASE_URL = "http://127.0.0.1:8000" // Cấu hình API base URL

export default function PlayList(): React.ReactNode {
  const [error, setError] = useState<string | null>(null)
  //const { id } = useParams() // Lấy giá trị của tham số id từ URL
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  //const playlistId = id ? Number(id) : Number(id)
  const navigate = useNavigate() // Hook điều hướng
  const { currentSong, isPaused } = useSelector((state: RootState) => state.player);
  const [playlistItem, setPlaylistItem] = useState<any>({})
  const audioPlayer: HTMLAudioElement | null = document.querySelector<HTMLAudioElement>('#audio-player');
  const toggleDetails = useAppControllerStore((state) => state.toggleDetails)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [playlists, setPlaylists] = useState([])
  const userId = Number(localStorage.getItem("idLogin"))

  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);
  const [theLoais, setTheLoais] = useState<any[]>([]);

  const [pendingAlbumIds, setPendingAlbumIds] = useState<number[]>([]);
  //-------------Phân loại route----------------------
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const danhSachPhatId = searchParams.get('danhsachphatid');
  const albumId = searchParams.get('albumid');
  const bxh = searchParams.get('bxh');
  console.log("songssongssongssongs", songs)
  const { refreshTrigger, refresh } = useRefresh();
  // premium

  const [songsPlayedCount, setSongsPlayedCount] = useState(0);
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  //Fetch danh sách thể loại
  useEffect(() => {
    const fetchTheLoais = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/loaibaihat/`);
        setTheLoais(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thể loại:", error);
      }
    };
    fetchTheLoais();
  }, []);

  useEffect(() => {
    const fetchPendingAlbums = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/album/albumpending/");
        const ids = response.data.albums.map((album: any) => album.album_id);
        setPendingAlbumIds(ids);
      } catch (error) {
        console.error("Lỗi khi fetch album pending:", error);
      }
    };

    fetchPendingAlbums();
  }, []);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        if(localStorage.getItem("idLogin") == undefined) 
        {
          handleUnauthorized();
          return;
        }
        const user = await getUserInfo("");
        console.log("User info:", user);

        // const userRes = await axios.get(`http://127.0.0.1:8000/nguoidung/api/chi-tiet-nguoi-dung/${user.id}`);
        // setIsPremium(userRes.data.la_premium || false);
        // console.log("Aaaaaaaaaaaaaaaaaaaaaaa: " + isPremium)
        // console.log("Aaaaaaaaaaaaaaaaaaaaaaa: " + userRes.data.la_premium)
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      }
    };

    fetchUser();
  }, []);
  // Hàm xử lý sự kiện nhấn nút Play/Pause

  const onClickPlay = useCallback((songs: any) => {
    const audioPlayer: HTMLAudioElement | null = document.querySelector<HTMLAudioElement>('#audio-player');
    if (!audioPlayer) {
      return
    } // Nếu không tìm thấy phần tử audio thì dừng
    audioPlayer.src = songs[0]?.duong_dan;
    dispatch(setCurrentSong(songs[0]))
    audioPlayer.load();
    audioPlayer.play();
  }, [audioPlayer])

  let playlistId: any;
  if (danhSachPhatId) {
    playlistId = Number(danhSachPhatId);
  } else if (albumId) {
    playlistId = Number(albumId);
  } else {
    playlistId = bxh;
  }


  const fetchSongs = async () => {
    try {
      setLoading(true);
      let data: any;
      // Lấy danh sách bài hát từ playlist
      if (danhSachPhatId) {
        data = await getSongFromPlayList(playlistId);
      } else if (albumId) {
        data = await getSongAlbum(playlistId);
      } else {
        data = await getSongBXH(playlistId);
      }
      const songDetails = await Promise.all(
        data.danh_sach_bai_hat.map(async (item: any) => {
          const songId = item.bai_hat;
          const songRes = await getSongById(songId); // Lấy thông tin bài hát
          console.log(songRes)
          const artistRes = await axios.get(`http://127.0.0.1:8000/api/nghesi/${songRes.nghe_si}`);
          const albumRes = await axios.get(`http://127.0.0.1:8000/album/${songRes.album}/`);

          return {
            bai_hat_id: songRes.bai_hat_id,
            bai_hat_id_2: songRes.bai_hat_id,
            ten_bai_hat: songRes.ten_bai_hat,
            the_loai: songRes.the_loai,
            duong_dan: songRes.duong_dan,
            loi_bai_hat: songRes.loi_bai_hat,
            is_premium: songRes.is_premium,
            thoi_luong: formatThoiLuong(songRes.thoi_luong),
            ngay_phat_hanh: format(new Date(songRes.ngay_phat_hanh), "MMM dd, yyyy"),
            album_id: albumRes?.data.album_id,
            ten_album: albumRes?.data.ten_album,
            anh_bia: songRes.url_image || albumRes?.data.anh_bia,
            nghe_si_id: artistRes?.data.nghe_si_id,
            nghe_si: artistRes?.data.ten_nghe_si,
            anh_dai_dien: artistRes?.data.anh_dai_dien,
            so_luot_nghe: item.so_luot_nghe,
          };
        })
      );

      // Thêm bài quảng cáo vào danh sách
      const adSong = {
        bai_hat_id: -12, // ID đặc biệt cho quảng cáo
        bai_hat_id_2: -12,
        ten_bai_hat: "Quảng cáo - Premium để bỏ quảng cáo",
        the_loai: "Advertisement",
        duong_dan: "https://spotifycloud.s3.ap-southeast-2.amazonaws.com/songs/Nghe+G%E1%BA%A7n+H%C6%A1n+(mp3cut.net).mp3",
        loi_bai_hat: "Nâng cấp lên Premium để tận hưởng âm nhạc không gián đoạn.",
        thoi_luong: "0:30",
        ngay_phat_hanh: format(new Date(), "MMM dd, yyyy"),
        album_id: null,
        ten_album: null,
        anh_bia: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQthU5peXNotfJ0VXcbXvEXjv4rEzkqtfJWw&s", // Hình ảnh cho quảng cáo
        nghe_si_id: null,
        nghe_si: "Quảng cáo",
        anh_dai_dien: null,
      };
      const user = await getUserInfo("");
      const userRes = await axios.get(`http://127.0.0.1:8000/nguoidung/api/chi-tiet-nguoi-dung/${user.id}`);
      const premiumStatus = userRes.data.la_premium || false;

      const songsWithAds = [];
      for (let i = 0; i < songDetails.length; i++) {
        // alert("isPremium2: "+premiumStatus)
        if (songDetails[i].is_premium == 1 && !premiumStatus)
          songDetails[i].duong_dan = "https://spotifycloud.s3.ap-southeast-2.amazonaws.com/songs/Nghe+G%E1%BA%A7n+H%C6%A1n+(mp3cut.net).mp3";
        songsWithAds.push(songDetails[i]);
        if ((i + 1) % 2 === 0 && !premiumStatus) {
          songsWithAds.push(adSong); // Chèn quảng cáo sau mỗi 2 bài
        }
      }
      const songsWithAds2 = [];
      for (let j = 0; j < songsWithAds.length; j++) {
        songsWithAds[j].bai_hat_id = j + 1;
        songsWithAds2.push(songsWithAds[j]);
      }

      setSongs(songsWithAds2);
      dispatch(setReduxSongs(songsWithAds2));

    } catch (err) {
      setError("Không thể tải danh sách bài hát.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {


    fetchSongs();
  }, [playlistId]);


  console.log("songssongssongssongssongssongs", songs)

  const [activeSongId, setActiveSongId] = useState<number | null>(null)
  const [clickCount, setClickCount] = useState(0)
  const dispatch = useDispatch();

  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const handleClick = (songId: number, song: Song) => {
    if (isPlayingAd) return; // Nếu đang phát quảng cáo, chặn phát bài khác

    if (!isPremium) {
      // Nếu không phải Premium, kiểm tra số bài đã phát
      if (songsPlayedCount > 2) {
        const adSong = songs.find((s) => s.bai_hat_id === -12); // Tìm bài quảng cáo

        if (adSong) {
          setIsPlayingAd(true);
          activeSong(adSong.bai_hat_id);
          dispatch(setCurrentSong(adSong));

          setTimeout(() => {
            setIsPlayingAd(false);
            setSongsPlayedCount(0); // Reset đếm số bài đã phát
            activeSong(songId);
            dispatch(setCurrentSong(song));
          }, 30000); // Quảng cáo phát trong 30s
          return;
        }
      }
    }

    if (activeSongId === songId) {
      if (clickCount === 1) {
        activeSong(songId);
        dispatch(setCurrentSong(song));
        setClickCount(0);
        toggleDetails()
      } else {
        setClickCount(1);
        setTimeout(() => setClickCount(0), 300);
      }
    } else {
      setActiveSongId(songId);
      if (clickCount === 1) {
        activeSong(songId);
        dispatch(setCurrentSong(song));
        setClickCount(0);
      } else {
        setClickCount(1);
        setTimeout(() => setClickCount(0), 300);
      }
    }

    setSongsPlayedCount((prev) => prev + 1); // Tăng số bài đã phát
  };


  const handleRightClick = (event: React.MouseEvent, bai_hat_id: any) => {
    event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    setIsModalOpen(true);
    setSelectedId(bai_hat_id);

    const { clientX, clientY } = event;
    const windowHeight = window.innerHeight;
    const menuHeight = 350; // Chiều cao ước lượng của menu

    // Nếu chuột gần cuối màn hình, dùng `bottom`, ngược lại dùng `top`
    const yPos = clientY + menuHeight > windowHeight ? windowHeight - clientY : clientY;

    setModalPosition({ x: clientX, y: yPos });

    console.log("📌 ID của item được click:", bai_hat_id);
  };

  const activeSong = (songId: number) => {
    console.log(`Bài hát ID ${songId} đang phát!`)
  }

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/danhsachphat/nguoidung/${userId}/`)
        setPlaylists(response.data)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
      }
    }
    fetchPlaylist()
  }, [refreshTrigger])



  useEffect(() => {
    const fetchPlaylistId = async () => {
      try {
        let response: any
        let playlistData;
        if (danhSachPhatId) {
          response = await axios.get(`${API_BASE_URL}/danhsachphat/${playlistId}/`)
          response = response.data
        } else if (albumId) {
          response = await axios.get(`${API_BASE_URL}/album/${playlistId}/`);
          const albumData = response.data;
          const artistResponse = await axios.get(`${API_BASE_URL}/api/nghesi/${albumData.nghe_si}`);

          // Convert từ album -> playlist format
          playlistData = {
            anh_danh_sach: albumData.anh_bia,
            danh_sach_phat_id: albumData.album_id,
            la_cong_khai: true, // Album public mặc định?
            mo_ta: `Album ${albumData.ten_album}`, // Tuỳ bạn
            ngay_tao: albumData.created_at,
            nguoi_dung_id: albumData.nghe_si, // ID nghệ sĩ
            so_nguoi_theo_doi: 0, // Album không có follower -> cho 0
            so_thu_tu: 1, // Tuỳ bạn set
            ten_danh_sach: albumData.ten_album,
            tong_thoi_luong: 0, // Chưa tính thời lượng -> set tạm 0 hoặc fetch thêm
            id_nghe_si: artistResponse.data.nghe_si_id, // Thêm tên nghệ sĩ
            ten_nghe_si: artistResponse.data.ten_nghe_si, // Thêm tên nghệ sĩ
            the_loai: albumData.the_loai, // Thêm thể loại
          };
          response = playlistData
        } else {
          response = await axios.get(`${API_BASE_URL}/bxh/api/get_BXH_theoten/${playlistId}`);
          const bxhData = response.data.playlistData;
          console.log(bxhData)
          response = bxhData
        }
        setPlaylistItem(response)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
      }
    }
    fetchPlaylistId()
  }, [playlistId])

  console.log("playlistItem", playlistItem)
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


  const imgRef = useRef<HTMLImageElement>(null);
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.crossOrigin = "anonymous";

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0, img.width, img.height);

      const imageData: any = ctx?.getImageData(0, 0, img.width, img.height).data;
      if (!imageData) return;

      let r = 0, g = 0, b = 0, count = 0;

      // Lấy mẫu mỗi 10 pixel để giảm tải
      for (let i = 0; i < imageData.length; i += 40) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      setColor(`rgb(${r}, ${g}, ${b})`);
    };
  }, []);

  if (error) return <div className="text-red-500">Lỗi khi tải danh sách phát</div>

  const handleSubmitSong = async () => {
    try {
      const values = await form.validateFields();
      const today = dayjs();
      if (values.ngay_phat_hanh && dayjs(values.ngay_phat_hanh).isAfter(today)) {
        message.error("Ngày phát hành không được vượt quá hôm nay!");
        return;
      }
      setUpdating(true);
      const formData = new FormData();
      for (const key in values) {
        if (key === "ngay_phat_hanh") {
          formData.append(key, values[key].format("YYYY-MM-DD"));
        } else {
          formData.append(key, values[key]);
        }
      }
      if (selectedFile) {
        formData.append("file_bai_hat", selectedFile);
      }
      if (albumId) {
        formData.append("album", playlistId.toString());
        formData.append("trang_thai_duyet", "pending");

      } else if (danhSachPhatId) {
        formData.append("nguoi_dung", userId.toString());
      }
      const response = await addBaiHat(formData);
      const newSongId = response.data.bai_hat_id;

      if (danhSachPhatId) {
        await handleAddSongToPlaylist(newSongId, playlistId);
      }

      message.success("Thêm bài hát thành công!");
      setIsAddSongModalOpen(false);
      setSelectedFile(null);
      form.resetFields();
      refresh();
      fetchSongs();
    } catch (error) {
      message.error("Lỗi khi thêm bài hát!");
      console.error("Error adding song:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col w-full ">
      <div className="w-[100%] p-4 flex justify-start items-center gap-6 rounded-t-[10px]"
        style={{
          background: `linear-gradient(to bottom, rgba(255,255,255,0.6) 0.5%, ${color} 99%)`,
        }}
      >
        <div className=" ">
          <img ref={imgRef} className="w-[232px] h-[232px] rounded-lg" src={playlistItem?.anh_danh_sach} alt="" />
        </div>
        <div className="">
          <div className="text-[14px] text-white translate-y-[30px]">
            {albumId ? "Album" : "Playlist"}
          </div>
          <div className="font-black text-[100px] text-white ml-[-4px]">
            {playlistItem.ten_danh_sach}
          </div>
          <div className="text-white-400 text-[14px]">{playlistItem.mo_ta}</div>
          <div className="text-white-400 text-[14px]">
            {albumId
              ? `${playlistItem.ten_nghe_si || "Unknown Artist"} • ${playlistItem.the_loai || "Unknown Genre"}`
              : `about ${formatSecondsToTime(Number(playlistItem?.tong_thoi_luong))}`}
          </div>
        </div>
      </div>
      <div className="w-[100%]  bg-black-500 p-4 pb-0 mt-4 pt-0 rounded-b-[10px] flex justify-between items-center gap-8">
        <div className="flex justify-start items-center gap-8">
          <div onClick={() => onClickPlay(songs)} className="bg-green-500 p-3  inline-block rounded-full hover:bg-green-400 transition">
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
      <div className="flex justify-end items-center gap-8">
        {((albumId && pendingAlbumIds.includes(Number(albumId)))) && (
          <Button
            type="primary"
            onClick={() => {
              form.resetFields();
              setSelectedFile(null);
              setIsAddSongModalOpen(true);
            }}
          >
            Thêm bài hát
          </Button>
        )}
      </div>


      <div className="grid grid-cols-[1%_28%_21%_22%_10%_10%] gap-4  text-gray-300 pl-4 pb-2 ml-6 mr-10 mb-3 mt-5 border-b border-gray-600 ">
        <div className="">#</div>
        <div className="">Title</div>
        <div className="">Album</div>
        <div className="">Date added</div>
        <div className=""><svg className="w-6 h-6 text-gray-300 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        </div>
        <div className="">Views</div>
      </div>
      <div>
        {songs
          .filter((song) => song?.the_loai !== "Advertisement") // Ẩn bài có id = -12
          .map((song: any, index) => (
            <div
              key={song?.bai_hat_id}
              onClick={() => handleClick(song?.bai_hat_id_2, song)}
              onContextMenu={(e) => handleRightClick(e, song?.bai_hat_id_2)}
              className={`grid grid-cols-[1%_28%_21%_22%_10%_10%] items-center gap-4 text-gray-300 pl-4 ml-6 mr-10 mb-3 pt-1 pb-1 transition rounded-[10px] ${currentSong?.bai_hat_id === song?.bai_hat_id ? "bg-gray-600" : "hover:bg-gray-800"}`}
            >
              <div>{index + 1}</div>
              <div className="flex items-center gap-2">
                <img
                  className="w-[50px] h-[50px] object-cover rounded-lg"
                  src={song?.anh_bia}
                  alt=""
                />
                <div>
                  <div
                    className="font-semibold text-white cursor-pointer hover:underline"
                    onClick={() => navigate(`/track/${song?.bai_hat_id}`)}
                  >
                    {song?.ten_bai_hat}
                  </div>
                  <div>{song?.nghe_si}</div>
                </div>
              </div>
              <div>{song?.ten_album}</div>
              <div>{song?.ngay_phat_hanh}</div>
              <div>{song?.thoi_luong}</div>
              <div>{song?.so_luot_nghe}</div>
            </div>
          ))}

      </div>
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-50">
          <div
            className="w-[250px] p-4 bg-black rounded-lg shadow-lg absolute"
            style={{
              top: modalPosition.y ? `${modalPosition.y}px` : "auto",
              left: `${modalPosition.x}px`,
              bottom: modalPosition.y ? "auto" : `${modalPosition.y}px`,
            }}
          >
            <p className="text-center text-lg font-semibold">Thêm vào danh sách phát</p>
            <div className="flex justify-between items-center flex-col mt-4 overflow-y-auto max-h-64">
              {playlists?.map((playlist: any) => (
                <div
                  key={playlist.danh_sach_phat_id}
                  onClick={() => handleAddSongToPlaylist(selectedId, playlist.danh_sach_phat_id)}
                  style={{ cursor: "pointer" }}
                  className="text-green-500 w-full"
                >
                  <div className="flex justify-start items-center p-2 gap-2">
                    <img src={playlist.anh_danh_sach} alt="" className="w-10 h-10 rounded-md object-cover" />
                    <span>{playlist.ten_danh_sach}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Modal
        title="Thêm bài hát"
        open={isAddSongModalOpen}
        onCancel={() => setIsAddSongModalOpen(false)}
        onOk={handleSubmitSong}
        confirmLoading={updating}
      >
        <Form form={form} layout="vertical" encType="multipart/form-data">
          <Form.Item name="ten_bai_hat" label="Tên bài hát" rules={[{ required: true, message: "Vui lòng nhập tên bài hát!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="the_loai" label="Thể loại" rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}>
            <Select placeholder="Chọn thể loại">
              {theLoais.map((tl) => (
                <Select.Option key={tl.loai_bai_hat_id} value={tl.loai_bai_hat_id}>
                  {tl.ten_loai}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="ngay_phat_hanh" label="Ngày phát hành" rules={[{ required: true, message: "Vui lòng chọn ngày phát hành!" }]}>
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current > dayjs().endOf("day")}
            />
          </Form.Item>
          <Form.Item name="nghe_si" initialValue={Number(playlistItem?.id_nghe_si)} hidden>
            <Input />
          </Form.Item>

          <Form.Item label="Tệp bài hát" rules={[{ required: true, message: "Vui lòng chọn file nhạc!" }]}>
            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file nhạc</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div >
  )
}
