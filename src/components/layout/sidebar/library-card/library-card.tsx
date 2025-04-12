import { useState } from "react";
import axios from "axios"; // Import axios
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import LibraryCardContent from "./library-card-content";
import LibraryCardImage from "./library-card-image";
interface Properties {
  isCollapsed?: boolean;
  playlist: {
    anh_danh_sach?: string;
    ten_danh_sach: string;
    so_nguoi_theo_doi: number;
    danh_sach_phat_id: number;
    mo_ta: string
  };
}

import { useNavigate } from "react-router-dom";
import { useRefresh } from "@/contexts/RefreshContext";

export default function LibraryCard({
  isCollapsed = true,
  playlist: { anh_danh_sach, ten_danh_sach, so_nguoi_theo_doi, danh_sach_phat_id, mo_ta },
}: Properties): React.ReactNode {
  // State điều khiển modal và ID được chọn
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate()
  const { refreshTrigger, refresh } = useRefresh(); // Lấy giá trị từ context

  // Xử lý click chuột phải
  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    setIsModalOpen(true);
    setSelectedId(danh_sach_phat_id);
  };

  // Hàm gọi API xóa danh sách phát
  const handleDelete = async () => {
    if (selectedId === null) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/danhsachphat/xoa/${selectedId}/`);
      console.log(`✅ Xóa danh sách phát thành công: ID ${selectedId}`);
      setIsModalOpen(false); // Đóng modal sau khi xóa thành công
      refresh()
    } catch (error) {
      console.error("❌ Lỗi khi xóa danh sách phát:", error);
    }
  };

  return (
    <div>
      {isCollapsed ? (
        <div onContextMenu={handleRightClick}>
          <TooltipWrapper
            side="right"
            sideOffset={12}
            tooltipContent={
              <LibraryCardContent name={ten_danh_sach} songCount={mo_ta} />
            }
          >
            <div className="flex items-center rounded-lg p-2 transition-colors duration-300 hover:bg-s-gray-darker" onClick={() => navigate(`/playlist/?danhsachphatid=${danh_sach_phat_id}`)}>
              <LibraryCardImage image={anh_danh_sach} />
            </div>
          </TooltipWrapper>
        </div>
      ) : (
        <div className="rounded-lg p-2 transition-colors duration-300 hover:bg-s-gray-dark">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <LibraryCardContent name={ten_danh_sach} songCount={mo_ta} />
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị modal khi click chuột phải */}
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-50">
          <div
            className="w-[250px] p-4 bg-black rounded-lg shadow-lg absolute top-[300px] left-[60px]"
          >
            <p className="text-center text-lg font-semibold">Bạn có chắc chắn muốn xóa?</p>
            <div className="flex justify-between mt-4 text-black">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                Hủy
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                Xóa
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
