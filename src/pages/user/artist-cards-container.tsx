// Import component `DynamicGrid` từ thư mục `@/components/ui/dynamic-grid`.
// `DynamicGrid` có thể là một component hiển thị danh sách các phần tử theo dạng lưới động.
import DynamicGrid from '../../components/ui/dynamic-grid';

// Import component `PlaylistCard` từ thư mục `@/components/ui/item-card`.
// `PlaylistCard` có thể là một component để hiển thị thông tin của từng nghệ sĩ hoặc playlist dưới dạng thẻ.
import PlaylistCard from '../../components/ui/item-card';

// Import kiểu dữ liệu `Playlist` từ `@/types`.
// `Playlist` có thể là một type hoặc interface định nghĩa cấu trúc dữ liệu của một playlist hoặc danh sách nghệ sĩ.
import { Playlist } from '../../types/types';

// Định nghĩa interface `Properties` để mô tả các props của component `ArtistCardsContainer`.
// - `title`: Tiêu đề của danh sách nghệ sĩ (bắt buộc).
// - `items`: Danh sách nghệ sĩ cần hiển thị (bắt buộc).
// - `description`: Mô tả danh sách nghệ sĩ (tuỳ chọn).
interface Properties {
  title: string;
  items: Playlist[] | any;
  description?: string;
}

// Định nghĩa component `ArtistCardsContainer` nhận vào ba props:
// - `title`: Tiêu đề danh sách nghệ sĩ.
// - `items`: Danh sách nghệ sĩ cần hiển thị.
// - `description`: Mô tả danh sách nghệ sĩ (nếu có).
export default function ArtistCardsContainer({ title, items, description }: Properties) {
  return (
    // Sử dụng component `DynamicGrid` để hiển thị danh sách nghệ sĩ dưới dạng lưới.
    <DynamicGrid<Playlist>
      title={title} // Truyền tiêu đề danh sách nghệ sĩ.
      items={items} // Truyền danh sách nghệ sĩ cần hiển thị.

      // Truyền component `PlaylistCard` vào `Component`.
      // `Component` là một hàm nhận vào `properties` và render `PlaylistCard`.
      // - `description="Artist"`: Gán mô tả mặc định là "Artist".
      // - `isArtist`: Thuộc tính này có thể giúp `PlaylistCard` biết rằng nó đang hiển thị nghệ sĩ.
      Component={(properties: any) => <PlaylistCard {...properties} description="Artist" isArtist />}

      description={description} // Truyền mô tả danh sách nghệ sĩ (nếu có).
    />
  );
}
