// Import component `ArtistCardsContainer` để hiển thị danh sách các nghệ sĩ hàng đầu.
import ArtistCardsContainer from './artist-cards-container';

// Import component `PlaylistCardsContainer` để hiển thị danh sách playlist công khai của người dùng.
import PlaylistCardsContainer from './playlist-cards-container';

// Import component `UserHeader` để hiển thị thông tin của người dùng như ảnh đại diện, tên, số playlist, số followers, số following.
import UserHeader from './user-header';

// Định nghĩa object `data` chứa thông tin của user và danh sách playlist công khai.
const data = {
  user: { // Thông tin người dùng
    name: 'Emre Can', // Tên người dùng
    image: "/public/uifaces-popular-image (1).jpg", // Đường dẫn ảnh đại diện của user
    playlistCount: 10, // Số lượng playlist công khai
    followers: 68, // Số người theo dõi user
    following: 68, // Số người mà user đang theo dõi
  },
  publicPlaylists: [ // Mảng chứa danh sách các playlist công khai của user
    {
      order: 1, // Thứ tự của playlist
      id: '1234567890', // ID duy nhất của playlist
      title: 'der Abgrund', // Tên của playlist
      image: "/public/uifaces-popular-image (1).jpg", // Đường dẫn ảnh playlist
      followers: 0, // Số lượng người theo dõi playlist này
    },
    {
      order: 2,
      id: '1234567891',
      title: 'Non-Metal',
      image: "/public/uifaces-popular-image (1).jpg",
      followers: 21,
    },
    {
      order: 3,
      id: '1234567892',
      title: 'ꟼЯΘGЯ3$$!Λ3',
      image: "/public/uifaces-popular-image (1).jpg",
      followers: 4,
    },
    {
      order: 4,
      id: '1234567893',
      title: 'bassın öne eğilmesin',
      image: "/public/uifaces-popular-image (1).jpg",
      followers: 1,
    },
    {
      order: 5,
      id: '1234567894',
      title: 'bir tüketim nesnesi olarak podcast',
      image: "/public/uifaces-popular-image (1).jpg",
      followers: 6,
    },
    {
      order: 6,
      id: '1234567895',
      title: 'D E A T H M E T A L',
      image: "/public/uifaces-popular-image (1).jpg",
      followers: 3,
    },
  ],
};

// Định nghĩa component `UserPage` để hiển thị trang cá nhân của người dùng.
export default function UserPage() {
  return (
    // Thẻ div cha chứa toàn bộ nội dung trang, sử dụng flexbox để hiển thị theo chiều dọc.
    <div className="flex flex-col pt-4 *:w-full">

      {/* Hiển thị header của user với thông tin từ `data.user` */}
      <UserHeader {...data.user} />

      {/* Container chứa các phần danh sách nghệ sĩ và playlist */}
      <div className="flex flex-col px-1">

        {/* Hiển thị danh sách nghệ sĩ hàng đầu trong tháng với tiêu đề "Top artists this month" */}
        <ArtistCardsContainer
          title="Top artists this month" // Tiêu đề danh sách nghệ sĩ
          items={data.publicPlaylists} // Dữ liệu danh sách nghệ sĩ (ở đây dùng chung với danh sách playlist)
          description="Only visible to you" // Mô tả: chỉ hiển thị cho chính user
        />

        {/* Hiển thị danh sách playlist công khai của user với tiêu đề "Public Playlists" */}
        <PlaylistCardsContainer
          title="Public Playlists" // Tiêu đề danh sách playlist công khai
          items={data.publicPlaylists} // Danh sách playlist công khai
          name={data.user.name} // Truyền tên user để hiển thị trong phần mô tả playlist
        />
      </div>
    </div>
  );
}
