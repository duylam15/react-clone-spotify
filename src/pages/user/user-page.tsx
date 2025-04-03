// Import component `ArtistCardsContainer` để hiển thị danh sách các nghệ sĩ hàng đầu.
import { useEffect, useState } from 'react';
import ArtistCardsContainer from './artist-cards-container';

// Import component `PlaylistCardsContainer` để hiển thị danh sách playlist công khai của người dùng.
import PlaylistCardsContainer from './playlist-cards-container';

// Import component `UserHeader` để hiển thị thông tin của người dùng như ảnh đại diện, tên, số playlist, số followers, số following.
import UserHeader from './user-header';
import { getUserInfo } from '@/services/user';
import { logoutUser } from '@/services/login';
import { useNavigate } from 'react-router-dom';

// Định nghĩa object `data` chứa thông tin của user và danh sách playlist công khai.
const data = {
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

  const [name, setName] = useState("No Name");
    const navigate = useNavigate()

  const user = { // Thông tin người dùng
    name: name, // Tên người dùng
    image: "/public/uifaces-popular-image (1).jpg", // Đường dẫn ảnh đại diện của user
    playlistCount: 99999, // Số lượng playlist công khai
    followers: 99999, // Số người theo dõi user
    following: 99999, // Số người mà user đang theo dõi
  }

  useEffect(() => {

    const fetchUser = async () => {
      const dataresponse = await getUserInfo();
      setName(dataresponse?.ten_hien_thi);
    };
    fetchUser()
  }, [])


  const handleLogout = async () => {
            try {
              const response = await logoutUser();
              console.log("Đăng xuất thành công:", response);
              navigate("/");
            } catch (error: any) {
              
            }
  };

  return (
    // Thẻ div cha chứa toàn bộ nội dung trang, sử dụng flexbox để hiển thị theo chiều dọc.
    <div className="flex flex-col pt-4 *:w-full">

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
      >
        Đăng xuất
      </button>
      {/* Hiển thị header của user với thông tin từ `data.user` */}
      <UserHeader {...user} />

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
          name={name} // Truyền tên user để hiển thị trong phần mô tả playlist
        />
      </div>
    </div>
  );
}
