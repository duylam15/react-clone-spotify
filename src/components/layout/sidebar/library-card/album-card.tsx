import { useState } from "react";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import LibraryCardContent from "./library-card-content";
import LibraryCardImage from "./library-card-image";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRefresh } from "@/contexts/RefreshContext";

interface AlbumProps {
  album: {
    album_id: number;
    ten_album: string;
    the_loai: string;
    anh_bia: string;
  };
}

export default function AlbumCard({ album }: AlbumProps): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { refresh } = useRefresh();

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedId(album.album_id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/album/xoa/${selectedId}/`);
      refresh();
    } catch (error) {
      console.error("❌ Lỗi khi xóa album:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  console.error("Album anh_bia:", album.anh_bia);

  return (
    <div onContextMenu={handleRightClick}>
      <TooltipWrapper
        side="right"
        tooltipContent={<LibraryCardContent name={album.ten_album} songCount={album.the_loai} />}
      >
        <div
          onClick={() => navigate(`/playlist/?albumid=${album.album_id}`)}
          className="flex items-center rounded-lg p-2 transition-colors duration-300 hover:bg-s-gray-darker"
        >
          <LibraryCardImage image={album.anh_bia} />
        </div>
      </TooltipWrapper>

      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-50">
          <div className="w-[250px] p-4 bg-black rounded-lg shadow-lg absolute top-[300px] left-[60px]">
            <p className="text-center text-lg font-semibold">Bạn có chắc muốn xóa album này?</p>
            <div className="flex justify-between mt-4 text-black">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setIsModalOpen(false)}>
                Hủy
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleDelete}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
