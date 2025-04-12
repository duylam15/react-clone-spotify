import AudioRecorder from "@/components/AudioRecorder";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface SearchResults {
  nghe_si: { nghe_si_id: number; ten_nghe_si: string; anh_dai_dien: string | null }[];
  bai_hat: { bai_hat_id: number; ten_bai_hat: string; duong_dan: string }[];
  albums: { album_id: number; ten_album: string; anh_bia: string | null }[];
}

export default function Search(): React.ReactNode {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [playlists, setPlaylists] = useState([])

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Vui lòng nhập từ khóa tìm kiếm!");
      setResults(null)
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://127.0.0.1:8000/common/api/search?q=${query}`);
      const data: SearchResults = await response.json();

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra hoặc không tìm thấy kết quả.");
      }
      console.log("data ablum , nghe si , bai hat")
      console.log(data);
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickSong = (duongDan: string) => {
    const audioPlayer: HTMLAudioElement | null = document.querySelector<HTMLAudioElement>('#audio-player');
    if (!audioPlayer) {
      return

    }
    console.log("audioPlayeraudioPlayeraudioPlayer", audioPlayer)
    audioPlayer.src = duongDan;
    audioPlayer.load();
    audioPlayer.play();
  };


  const handleClickArtis = (id: number) => {
    console.log("id nghe si : " + id);
  }

  const handleClickAlbum = (id: number) => {
    console.log("id album" + id);
  }

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
  const API_BASE_URL = "http://127.0.0.1:8000" // Cấu hình API base URL

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const userId = localStorage.getItem("idLogin")
        const response = await axios.get(`${API_BASE_URL}/danhsachphat/nguoidung/${userId}/`)
        setPlaylists(response.data)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
      }
    }
    fetchPlaylist()
  }, [])

  return (
    <div className="flex flex-col items-center w-full h-full p-6 bg-[#121212]">
      <h2 className="text-2xl font-bold mb-6 text-white">Tìm kiếm bài hát, nghệ sĩ, album</h2>

      {/* Thanh tìm kiếm */}
      <div className="w-full flex">
        <input
          type="text"
          className="flex-grow p-4 border border-gray-700 bg-[#212121] text-white placeholder-gray-400 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nhập từ khóa..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="text-white px-6 py-4 rounded-r-lg bg-green-500 hover:bg-green-600 transition duration-300 text-lg"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
        <AudioRecorder />
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {/* Bộ lọc danh mục */}
      <div className="mt-4 flex space-x-4">
        {["all", "nghe_si", "bai_hat", "albums"].map((item) => (
          <button
            key={item}
            className={`hover:bg-green-500 px-4 py-2 rounded-md text-white ${filter === item ? "bg-green-500" : "bg-gray-700"}`}
            onClick={() => setFilter(item)}
          >
            {item === "all" ? "Tất cả" : item === "nghe_si" ? "Nghệ sĩ" : item === "bai_hat" ? "Bài hát" : "Album"}
          </button>
        ))}
      </div>

      {results && (
        <div className="mt-6 w-full bg-inherit p-5 shadow-lg rounded-lg">


          {/* Bài hát */}
          {(filter === "all" || filter === "bai_hat") && (
            <div className="mb-6 pb-4">
              <h4 className="font-bold text-lg text-white">🎵 Bài hát</h4>
              <ul className="mt-2 list-disc ml-4 text-white">
                {results.bai_hat.length > 0 ? (
                  results.bai_hat
                    .slice(0, filter === "all" ? 5 : results.bai_hat.length)
                    .map((song) => <li
                      key={song.bai_hat_id}
                      className="cursor-pointer hover:text-blue-400"
                      onClick={() => handleClickSong(song.duong_dan)}
                      onContextMenu={(e) => handleRightClick(e, song?.bai_hat_id)}

                    >{song.ten_bai_hat}</li>)
                ) : (
                  <p className="text-gray-300">Không tìm thấy bài hát.</p>
                )}
              </ul>
            </div>
          )}

          {/* Nghệ sĩ */}
          {(filter === "all" || filter === "nghe_si") && (
            <div className="mb-6 pb-4">
              <h4 className="font-bold text-lg text-white">🎤 Nghệ sĩ</h4>
              <div className="flex flex-wrap gap-6 justify-start mt-2">
                {results.nghe_si.length > 0 ? (
                  results.nghe_si
                    .slice(0, filter === "all" ? 5 : results.nghe_si.length)
                    .map((artist) => (
                      <div key={artist.nghe_si_id} className="flex flex-col items-center w-28">
                        <img
                          src={artist.anh_dai_dien || "/default-avatar.jpg"}
                          alt={artist.ten_nghe_si}
                          className="w-24 h-24 object-cover rounded-full border-2 border-white cursor-pointer"
                        />
                        <p className="mt-2 text-white text-sm text-center cursor-pointer hover:text-blue-400">
                          {artist.ten_nghe_si}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-300 cursor-pointer hover:text-blue-400" >Không tìm thấy nghệ sĩ.</p>
                )}
              </div>
            </div>
          )}

          {/* Albums */}
          {(filter === "all" || filter === "albums") && (
            <div className="mb-4">
              <h4 className="font-bold text-lg text-white">📀 Albums</h4>
              <div className="flex flex-wrap gap-6 justify-start">
                {results.albums.length > 0 ? (
                  results.albums
                    .slice(0, filter === "all" ? 5 : results.albums.length)
                    .map((album) => (
                      <div key={album.album_id} className="flex flex-col items-center w-28">
                        <img
                          src={album.anh_bia || "/default-album.jpg"}
                          alt={album.ten_album}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-white cursor-pointer"
                          onClick={() => handleClickAlbum(album.album_id)}
                        />
                        <p className="mt-2 text-white text-sm text-center cursor-pointer" onClick={() => handleClickAlbum(album.album_id)}>{album.ten_album}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-300">Không tìm thấy album.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
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
    </div>
  );
}
