// Import component `DynamicGrid` từ thư mục `@/components/ui/dynamic-grid`.
// `DynamicGrid` có thể là một component giúp hiển thị danh sách phần tử theo dạng lưới động.
import DynamicGrid from '../../components/ui/dynamic-grid';

// Import component `PlaylistCard` từ thư mục `@/components/ui/item-card`.
// `PlaylistCard` có thể là một component hiển thị thông tin của từng playlist dưới dạng thẻ.
import PlaylistCard from '../../components/ui/item-card';

// Import kiểu dữ liệu `Playlist` từ `../../types`.
// `Playlist` có thể là một type hoặc interface định nghĩa cấu trúc dữ liệu của một playlist.
import { Playlist } from '../../types/types';

// Định nghĩa interface `Properties` để mô tả các props của component `PlaylistCardsContainer`.
// - `title`: Tiêu đề của danh sách playlist (bắt buộc).
// - `items`: Danh sách playlist cần hiển thị (bắt buộc).
// - `name`: Tên của người tạo playlist hoặc chủ sở hữu danh sách.
interface Properties {
  title: string;
  items: Playlist[] | any;
  name: string;
}

// Định nghĩa component `PlaylistCardsContainer` nhận vào ba props:
// - `title`: Tiêu đề danh sách playlist.
// - `items`: Danh sách playlist cần hiển thị.
// - `name`: Tên của người tạo playlist hoặc chủ sở hữu danh sách.
export default function PlaylistCardsContainer({ title, items, name }: Properties) {
  return (
    // Sử dụng component `DynamicGrid` để hiển thị danh sách playlist theo dạng lưới.
    <DynamicGrid<Playlist>
      title={title} // Truyền tiêu đề danh sách playlist.
      items={items} // Truyền danh sách playlist cần hiển thị.

      // Truyền component `PlaylistCard` vào `Component`.
      // `Component` là một hàm nhận vào `properties` và render `PlaylistCard`.
      Component={(properties: any) => (
        <PlaylistCard
          {...properties} // Spread tất cả thuộc tính từ `properties` vào `PlaylistCard`.

          // Thiết lập thuộc tính `description` dựa trên số lượng người theo dõi (`followers`):
          // - Nếu số `followers` > 0, hiển thị số lượng người theo dõi (ví dụ: "100 Followers").
          // - Nếu không, hiển thị tên chủ sở hữu danh sách (ví dụ: "By John Doe").

          showFollowers // Kích hoạt hiển thị số lượng người theo dõi.
        />
      )}
    />
  );
}
