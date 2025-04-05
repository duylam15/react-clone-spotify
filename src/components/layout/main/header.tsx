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
import { fetchAccessToken, getUserInfo } from '@/services/user'

// Định nghĩa component Header
export default function Header(): React.ReactNode {
  // Sử dụng hook `useNavigate` để điều hướng trang
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(false) // Trạng thái đăng nhập

  // Lấy giá trị chiều rộng của header từ `useAppControllerStore`
  const width = useAppControllerStore((state) => state.mainWidth)

  // Dùng `useMemo` để tránh render lại không cần thiết khi `width` không thay đổi
  const memoizedWidth = useMemo(() => ({ width }), [width])

  // Gán username cố định (có thể thay bằng giá trị động trong thực tế)
  const [username, setusername] = useState("no name")
  const [idUser , setIdUser] = useState(1);

  useEffect(() => {
    const checkLogin = async () => {
      const response = await fetchAccessToken(null);
      console.log("------------------------------------ check login")
      console.log(response)
      if(response.status == 401)
        setIsLogin(false)
      else
        {
          setIsLogin(true)
          const dataUser = await getUserInfo("");
          setusername(dataUser.ten_hien_thi)
          setIdUser(dataUser.id)
        }
    }
    checkLogin()
    setIsLogin(Number(localStorage.getItem("isLogin")) != null)
  } , [])

  return (
    <div style={memoizedWidth} className="absolute z-10 flex justify-between px-6 py-4">

      {/* Nhóm các nút điều hướng */}
      <div className="flex flex-row items-center gap-2">
        <TooltipWrapper tooltipContent="Go back" side="bottom">
          <button
            className="flex size-8 items-center justify-center rounded-full bg-black/70 text-white"
            onClick={() => navigate(-1)}
          >
            <ChevronLeftIcon className="relative -left-px" strokeWidth={1} size={32} />
          </button>
        </TooltipWrapper>

        <TooltipWrapper tooltipContent="Go forward" side="bottom">
          <button
            className="flex size-8 items-center justify-center rounded-full bg-black/70 text-white"
            onClick={() => navigate(1)}
          >
            <ChevronRightIcon className="relative left-px" strokeWidth={1} size={32} />
          </button>
        </TooltipWrapper>
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
                className="flex size-8 items-center justify-center rounded-full bg-black/50 text-s-gray-lighter hover:size-9 hover:text-white"
                onClick={() => navigate('/feed')}
              >
                <BellIcon strokeWidth={2} size={18} />
              </button>
            </div>
          </TooltipWrapper>

          <TooltipWrapper tooltipContent={username} side="bottom">
            <Link to={`/user/profile?id=${idUser}`} className="flex size-9 items-center justify-center">
              <div className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/50 hover:size-[33px] hover:bg-black/70">
                <img
                  src="/public/uifaces-popular-image (2).jpg"
                  width={24}
                  height={24}
                  alt="avatar"
                  className="size-6 rounded-full"
                />
              </div>
            </Link>
          </TooltipWrapper>
        </div>
      )}
    </div>
  )
}
