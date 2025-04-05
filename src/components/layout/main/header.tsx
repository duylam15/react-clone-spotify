// Import các icon cần sử dụng từ thư viện `lucide-react`
import { BellIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

// Import `useMemo` từ React để tối ưu hóa hiệu suất tính toán lại giá trị
import { useEffect, useMemo, useState } from 'react'

// Import `Link` và `useNavigate` từ `react-router-dom` để điều hướng trang
import { Link, useNavigate } from 'react-router-dom'

// Import component TooltipWrapper để hiển thị tooltip khi hover vào các nút
import TooltipWrapper from '@/components/ui/tooltip-wrapper'

// Import custom hook `useAppControllerStore` để lấy dữ liệu `mainWidth` từ state của app
import { useAppControllerStore } from '@/features/appControllerStore'
import { getUserInfo } from '@/services/user'
import { logoutUser } from '@/services/login'
import { useRefresh } from '@/contexts/RefreshContext'

// Định nghĩa component Header
export default function Header(): React.ReactNode {
  // Sử dụng hook `useNavigate` để điều hướng trang
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(false) // Trạng thái đăng nhập

  // Lấy giá trị chiều rộng của header từ `useAppControllerStore`
  const width = useAppControllerStore((state) => state.mainWidth)

  // Dùng `useMemo` để tránh render lại không cần thiết khi `width` không thay đổi
  const memoizedWidth = useMemo(() => ({ width }), [width])
  const idUser = Number(localStorage.getItem("idLogin"))
  console.log(idUser)
  // Gán username cố định (có thể thay bằng giá trị động trong thực tế)
  const [username, setusername] = useState("no name")
  const [user, setUser] = useState<any>()
  const { refreshTrigger, refresh } = useRefresh(); // Lấy giá trị từ context


  useEffect(() => {
    const checkLogin = async () => {
      if (localStorage.getItem("idLogin") == undefined)
        setIsLogin(false)
      else {
        setIsLogin(true)
        const dataUser = await getUserInfo("");
        setusername(dataUser.ten_hien_thi)
      }
    }
    checkLogin()
  }, [])


  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem("idLogin") == undefined) return;
      const dataresponse = await getUserInfo(idUser);
      console.log("dataresponsedataresponse", dataresponse)
      setUser(dataresponse)
    };
    fetchUser()
  }, [])


  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      localStorage.removeItem("idLogin")
      console.log("Đăng xuất thành công:", response);
      refresh()
      setIsLogin(false);
    } catch (error: any) {

    }
  };

  return (
    <div style={memoizedWidth} className="absolute z-10 flex justify-between px-6 py-4">

      {/* Nhóm các nút điều hướng */}
      <div className="flex flex-row items-center gap-2">

      </div>

      {/* Nếu chưa đăng nhập, hiển thị nút Login */}
      {!isLogin ? (
        <button
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-800"
          onClick={() => navigate('/login')} // Chuyển hướng đến trang đăng nhập
        >
          Login
        </button>
      ) : (
        /* Nếu đã đăng nhập, hiển thị nhóm nút bên phải */
        <div className="flex h-9 flex-row items-center">
          <TooltipWrapper tooltipContent="What's New" side="bottom">
            <div className="flex size-9 items-center justify-center">
              <button
                className="flex size-10 items-center justify-center rounded-full bg-black/50 text-s-gray-lighter hover:size-9 hover:text-white mr-8"
                onClick={() => navigate('/feed')}
              >
                <BellIcon strokeWidth={2} size={24} />
              </button>
            </div>
          </TooltipWrapper>

          <div className="relative flex  items-center justify-center group">
            <div className="flex cursor-pointer items-center justify-center rounded-full bg-black/50  hover:bg-black/70">
              <img
                src={user?.avatar_url}
                width={24}
                height={24}
                alt="avatar"
                className="size-10 rounded-full"
              />
            </div>


            {/* Nút "Xem thông tin cá nhân" và "Đăng xuất" */}
            <div className="absolute hidden group-hover:flex flex-col items-center bg-gray-700  rounded-md  top-[35px] left-[-50px] transform -translate-x-1/2">
              <button className="text-white hover:bg-black p-2 w-[180px] rounded-md "
                onClick={() => navigate(`/user/profile?id=${idUser}`)} // Chuyển hướng đến trang đăng nhập
              >Xem thông tin cá nhân</button>
              <button className="text-white hover:bg-black p-2 w-[180px] rounded-md " onClick={handleLogout}>Đăng xuất</button>
            </div>

          </div>

        </div>
      )}
    </div>
  )
}
