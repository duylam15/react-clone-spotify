import React, { useState } from "react";

interface SearchResults {
  nghe_si: { id: number; ten_nghe_si: string; anh_dai_dien: string | null }[];
  bai_hat: { id: number; ten_bai_hat: string; duong_dan: string }[];
  albums: { id: number; ten_album: string; anh_bia: string | null }[];
}

export default function Search(): React.ReactNode {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

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
    console.log(`Đường dẫn bài hát: ${duongDan}`);
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-6 bg-inherit">
      <h2 className="text-2xl font-bold mb-6 text-white">Tìm kiếm bài hát, nghệ sĩ, album</h2>

      {/* Thanh tìm kiếm */}
      <div className="w-full flex">
        <input
          type="text"
          className="flex-grow p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          placeholder="Nhập từ khóa..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-6 py-4 rounded-r-lg hover:bg-blue-600 transition duration-300 text-lg"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {/* Bộ lọc danh mục */}
      <div className="mt-4 flex space-x-4">
        {["all", "nghe_si", "bai_hat", "albums"].map((item) => (
          <button
            key={item}
            className={`px-4 py-2 rounded-md text-white ${filter === item ? "bg-blue-500" : "bg-gray-700"}`}
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
                      key={song.id}
                      className="cursor-pointer hover:text-blue-400"
                      onClick={() => handleClickSong(song.duong_dan)}
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
                      <div key={artist.id} className="flex flex-col items-center w-28">
                        <img
                          src={artist.anh_dai_dien || "/default-avatar.jpg"}
                          alt={artist.ten_nghe_si}
                          className="w-24 h-24 object-cover rounded-full border-2 border-white"
                        />
                        <p className="mt-2 text-white text-sm text-center">{artist.ten_nghe_si}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-300">Không tìm thấy nghệ sĩ.</p>
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
                      <div key={album.id} className="flex flex-col items-center w-28">
                        <img
                          src={album.anh_bia || "/default-album.jpg"}
                          alt={album.ten_album}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-white"
                        />
                        <p className="mt-2 text-white text-sm text-center">{album.ten_album}</p>
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
    </div>
  );
}
