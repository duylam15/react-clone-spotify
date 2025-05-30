// Import component `ArtistCardsContainer` để hiển thị danh sách các nghệ sĩ hàng đầu.
import { useEffect, useState } from 'react';
import ArtistCardsContainer from './artist-cards-container';

// Import component `PlaylistCardsContainer` để hiển thị danh sách playlist công khai của người dùng.
import PlaylistCardsContainer from './playlist-cards-container';

// Import component `UserHeader` để hiển thị thông tin của người dùng như ảnh đại diện, tên, số playlist, số followers, số following.
import UserHeader from './user-header';
import { getUserInfo } from '@/services/user';
import { logoutUser } from '@/services/login';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


// Định nghĩa component `UserPage` để hiển thị trang cá nhân của người dùng.
export default function UserPage() {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id"); // Lấy giá trị của tham số "id"

  const [name, setName] = useState("No Name");
  const [user, setUser] = useState<any>();
  const navigate = useNavigate()

  const [userInfo , setUserInfor] = useState({
    avatar_url: user?.avatar_url,
    email: user?.email,
    gioi_tinh: user?.gioi_tinh,
    ngay_sinh: user?.ngay_sinh,
    ten_hien_thi: user?.ten_hien_thi,
  })

  const fetchUser = async () => {
    if (localStorage.getItem("idLogin") == undefined)
      return;
    const dataresponse = await getUserInfo(id);
    console.log(dataresponse)
    console.log("id---------------------------------" + id)
    setName(dataresponse?.ten_hien_thi);
    setUser(dataresponse)
    setUserInfor({
      avatar_url: dataresponse?.avatar_url,
      email: dataresponse?.email,
      gioi_tinh: dataresponse?.gioi_tinh,
      ngay_sinh: dataresponse?.ngay_sinh,
      ten_hien_thi: dataresponse?.ten_hien_thi,
    })
  };


  useEffect(() => {

    fetchUser()
  }, [])

  const [loading, setLoading] = useState(true)
  useEffect(() => {

    fetchUser()
  }, [loading])




  const [danhSachPhat, setDanhSachPhat] = useState([])
  const [error, setError] = useState(null)
  const userId = Number(localStorage.getItem("idLogin"))
  console.log("danhSachPhatdanhSachPhatdanhSachPhat", danhSachPhat)
  useEffect(() => {
    const fetchDanhSachPhat = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/danhsachphat/nguoidung/${userId}`)
        setDanhSachPhat(response.data)
      } catch (err: any) {
        setError(err.message)
        setDanhSachPhat([])
        setUser("")
      } finally {
        setLoading(false)
      }
    }

    fetchDanhSachPhat()
  }, [])

  return (
    // Thẻ div cha chứa toàn bộ nội dung trang, sử dụng flexbox để hiển thị theo chiều dọc.
    <div className="flex flex-col pt-4 *:w-full">

      {/* Hiển thị header của user với thông tin từ `data.user` */}
      <UserHeader {...userInfo }/>

      {/* Container chứa các phần danh sách nghệ sĩ và playlist */}
      <div className="flex flex-col px-1">

        {/* Hiển thị danh sách playlist công khai của user với tiêu đề "Public Playlists" */}
        <PlaylistCardsContainer
          title="Public Playlists" // Tiêu đề danh sách playlist công khai
          items={danhSachPhat} // Danh sách playlist công khai
          name={name} // Truyền tên user để hiển thị trong phần mô tả playlist
        />
      </div>
    </div>
  );
}
