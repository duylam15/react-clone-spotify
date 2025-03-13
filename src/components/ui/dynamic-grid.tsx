// Import `Link` từ thư viện `react-router-dom` để tạo các liên kết điều hướng.
import { Link } from 'react-router-dom'

// Import `useAppControllerStore` từ thư mục `features/appControllerStore` để lấy dữ liệu từ store.
import { useAppControllerStore } from '@/features/appControllerStore'

// Import hàm `cn` từ thư mục `lib/utils`, có thể là hàm giúp kết hợp className linh hoạt.
import { cn } from '@/utils/utils'

// Định nghĩa interface `OrderableAndIndexable` để mô tả một đối tượng có `id` và `order`.
interface OrderableAndIndexable {
  danh_sach_phat_id: number // `id` có thể là số hoặc chuỗi.
  order: number // `order` là một số, dùng để sắp xếp.
}

// Định nghĩa kiểu dữ liệu `Properties` để truyền vào component `DynamicGrid`.
interface Properties<T extends OrderableAndIndexable> {
  danh_sach_phat_id?: number
  className?: string // Class tùy chỉnh cho component.
  title: string // Tiêu đề của component.
  description?: string // Mô tả (tùy chọn).
  items: T[] // Danh sách các phần tử (mảng đối tượng có `id` và `order`).
  to?: string // Đường dẫn liên kết (tùy chọn).
  Component: React.FC<T> // 👈 Dùng React.FC<T> thay vì function
  // Component để hiển thị từng phần tử trong danh sách.
}

// Định nghĩa kích thước cố định cho mỗi card trong lưới (grid).
const cardSizePx = 220

// Component `DynamicGrid` là một component generic nhận vào kiểu dữ liệu `T`.
export default function DynamicGrid<T>({
  className, // Class tùy chỉnh.
  title, // Tiêu đề của grid.
  description, // Mô tả (tùy chọn).
  items, // Danh sách các phần tử.
  to, // Đường dẫn liên kết (tùy chọn).
  Component, // Component dùng để render từng item.
}: Properties<T extends OrderableAndIndexable ? T : never>): React.ReactNode {
  // Lấy chiều rộng của phần chính từ `useAppControllerStore`.
  const width = useAppControllerStore((state) => state.mainWidth)

  // Tính số cột có thể hiển thị dựa vào chiều rộng hiện tại.
  const columnCount = Math.floor(width / cardSizePx)
  console.log("items from grid", items)
  return (
    <div>
      {/* Thanh tiêu đề với tiêu đề và nút "Show all" */}
      <div className={cn('flex w-full items-center justify-between px-3.5 py-2', className)}>
        {/* Link tiêu đề, nếu `to` không được truyền thì mặc định về `/` */}
        <Link to={to ?? '/'}>
          <button type="button" className="text-2xl font-bold text-white no-underline hover:underline">
            {title}
          </button>
        </Link>
        {/* Nút "Show all" để điều hướng đến danh sách đầy đủ */}
        <Link to={to ?? '/'}>
          <button
            type="button"
            className="box-decoration-slice text-sm font-bold text-s-gray-lighter no-underline hover:underline"
          >
            Show all
          </button>
        </Link>
      </div>

      {/* Nếu có mô tả thì hiển thị */}
      {description && <p className="px-3.5 text-sm text-s-gray-lighter">{description}</p>}

      {/* Vùng hiển thị danh sách các item theo dạng grid */}
      <div style={getGridStyle(columnCount)}>
        {items
          .slice(0, columnCount) // Lấy số lượng phần tử phù hợp với số cột.
          .sort((a, b) => a.order - b.order) // Sắp xếp theo thứ tự `order`.
          .map((playlist) => (
            <Component key={playlist.danh_sach_phat_id} {...playlist} /> // Render từng item bằng component được truyền vào.
          ))}
      </div>
    </div>
  )
}

// Hàm `getGridStyle` trả về một đối tượng chứa style CSS để hiển thị dạng lưới (grid).
function getGridStyle(columnCount: number): React.CSSProperties {
  return {
    display: 'grid', // Sử dụng CSS Grid.
    gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, // Tạo `columnCount` cột với kích thước bằng nhau.
  }
}
