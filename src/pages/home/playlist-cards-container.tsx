// Import component `DynamicGrid` từ thư mục `@/components/ui/dynamic-grid`.
// `DynamicGrid` có thể là một component hiển thị danh sách các phần tử theo dạng lưới động.
import DynamicGrid from '@/components/ui/dynamic-grid';

// Import component `ItemCard` từ thư mục `@/components/ui/item-card`.
// `ItemCard` có thể là một component để hiển thị từng item trong danh sách dưới dạng thẻ.
import ItemCard from '@/components/ui/item-card';

// Import kiểu dữ liệu `Playlist` từ `@/types`.
// `Playlist` có thể là một type hoặc interface định nghĩa cấu trúc dữ liệu của một playlist.
import { Playlist } from '@/types/types';
import { Song } from '@/types/types';

// Định nghĩa component `PlaylistCardsContainer` nhận vào hai props:
// - `title`: Chuỗi tiêu đề của danh sách playlist.
// - `items`: Mảng các playlist có kiểu `Playlist[]`.


export default function PlaylistCardsContainer({ title, items }: { title: string; items: Playlist[] }) {
  console.log("items", items)
  console.log("title", title)
  return (
    // Trả về component `DynamicGrid`, truyền vào các props sau:
    // - `title`: Tiêu đề của danh sách playlist.
    // - `items`: Danh sách các playlist cần hiển thị.
    // - `Component`: Component `ItemCard` để hiển thị từng phần tử trong danh sách.
    <div>
      {/* Render các playlist */}
      <DynamicGrid<Playlist> title={title} items={items} Component={ItemCard} />
    </div>
  );
}
