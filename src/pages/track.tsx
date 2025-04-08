import { useCallback, useEffect, useState } from "react"
import { Playlist } from "@/types/types"
import { useParams } from "react-router-dom"
import { getSongById, } from "@/services/playlistAPI"
import axios from "axios"
import { setCurrentSong } from "@/stores/playlist/playerSlice"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/stores/playlist"

export default function Track(): React.ReactNode {
  const [song, setSong] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams() // Lấy giá trị của tham số id từ URL
  const playlistId = id ? Number(id) : Number(id)

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await getSongById(playlistId)
        setSong(response)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
        setError(err)
      }
    }
    fetchPlaylist()
  }, [])


  console.log("songsongxxxsong", song?.loi_bai_hat)



  const [album, setAlbum] = useState<any>();
  const [nghesi, setNgheSi] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!song?.album) return; // Kiểm tra nếu song hoặc song.album chưa có thì không gọi API

    const fetchAlbum = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/album/${song?.album}/`);
        setAlbum(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [song]);

  useEffect(() => {
    if (!song?.nghe_si) return; // Kiểm tra nếu song hoặc song.album chưa có thì không gọi API

    const fetchAlbum = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/nghesi/${song?.nghe_si}`);
        setNgheSi(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [song]);

  const audioPlayer: HTMLAudioElement | null = document.querySelector<HTMLAudioElement>('#audio-player');
  const dispatch = useDispatch();
  const onClickPlay = useCallback((song: any) => {
    console.log(song?.duong_dan)
    const audioPlayer: HTMLAudioElement | null = document.querySelector<HTMLAudioElement>('#audio-player');

    if (!audioPlayer) {
      return
    }
    audioPlayer.src = song?.duong_dan;
    dispatch(setCurrentSong(song))
    audioPlayer.load();
    audioPlayer.play();
  }, [audioPlayer])

  const lyrics = song?.loi_bai_hat || "";

  // Tách theo chữ cái viết hoa mà có chữ thường theo sau — tức là đầu câu mới
  const splitLyrics = lyrics.split(/(?=[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ])/g).map((s: any) => s.trim());
  const currentSong: any = useSelector((state: RootState) => state.player.currentSong);

  const downloadAudio = async () => {
    const audioUrl = currentSong?.duong_dan; // URL của file âm thanh
    const fileName = currentSong?.ten_bai_hat + ".mp3"; // Thêm phần mở rộng .mp3 vào tên file nếu chưa có

    try {
      const response = await fetch(audioUrl, {
        method: "GET",
        headers: {
          "Content-Type": "audio/mp3", // Sử dụng content-type cho âm thanh MP3
        },
      });

      if (!response.ok) throw new Error("Lỗi khi tải file");

      const blob = await response.blob(); // Chuyển dữ liệu thành Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Tạo thẻ <a> ẩn để tải file
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName); // Thiết lập tên file tải về
      document.body.appendChild(link);
      link.click();

      // Xóa object URL để tiết kiệm bộ nhớ
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Tải xuống thất bại", error);
    } finally {
    }
  };



  return (
    <div className="flex flex-col w-full ">
      <div className="w-[100%]  bg-black-500 p-5 flex justify-start items-center gap-6 rounded-t-[10px]">
        <div className=" ">
          <img className="w-[232px] h-[232px] rounded-lg" src={nghesi?.anh_dai_dien} alt="" />
        </div>
        <div className="">
          <div className="text-[14px] text-white translate-y-[30px]">Song</div>
          <div className="font-black text-[100px] text-white ml-[-4px]">{song?.ten_bai_hat}</div>
          <div className="text-gray-400 text-[14px]">{album?.ten_album} {nghesi?.ten_nghe_si}</div>
        </div>
      </div>
      <div className="w-[100%]  bg-black-500 p-5 pt-0 pb-0 rounded-b-[10px] flex justify-between items-center gap-8">
        <div className="flex justify-start items-center gap-8">
          <div onClick={() => onClickPlay(song)} className="bg-green-500 p-3 inline-block rounded-full hover:bg-green-400 transition">
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
      <div className="text-gray-400 flex items-start justify-between p-5">
        <div >
          <div className="text-white">Lyric</div>
          <div className="mt-3 space-y-1">
            {splitLyrics.map((line: any, index: any) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
        <div className="w-[500px] p-4 flex items-center justify-start gap-4">
          <img className="w-[70px] h-[70px] rounded-full" src={nghesi?.anh_dai_dien} alt="" />
          <div className="text-white ">
            <div>Artist</div>
            <div>{nghesi?.ten_nghe_si}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

