// Import các hooks `useEffect` và `useRef` từ React.
// `useEffect` được sử dụng để thực thi code sau khi component render hoặc cập nhật.
// `useRef` giúp tạo tham chiếu đến một phần tử DOM.
import { useEffect, useRef } from 'react';

// Import `Outlet` từ `react-router-dom` để render nội dung của các route con trong layout.
import { Outlet } from 'react-router-dom';

// Import các component `Footer` và `Sidebar` từ thư mục `layout`.
import Footer from '../components/layout/footer';
import Sidebar from '../components/layout/sidebar';

// Import các component hỗ trợ giao diện có thể thay đổi kích thước (Resizable UI).
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/ui/resizable';

// Import `Header` từ thư mục layout.
import Header from '../components/layout/main/header';

// Import `ScrollArea` và `ScrollBar` để tạo vùng nội dung có thể cuộn.
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area';

// Import `useAppControllerStore`, một custom hook giúp quản lý state của ứng dụng.
import { useAppControllerStore } from '../features/appControllerStore';

// Định nghĩa component `Layout` - đây là layout chính của ứng dụng.
export default function Layout() {
  // Lấy hàm `setMainWidth` từ store để cập nhật chiều rộng của phần main.
  const setMainWidth = useAppControllerStore((state) => state.setMainWidth);

  // Tạo tham chiếu (`ref`) cho phần main và sidebar để có thể truy cập trực tiếp vào DOM.
  const mainReference = useRef<HTMLDivElement>(null);
  const sidebarReference = useRef<HTMLDivElement>(null);

  // `useEffect` chạy một lần sau khi component render.
  useEffect(() => {
    // Lấy DOM element của phần main từ `ref`.
    const mainCurrent = mainReference.current;
    // Nếu không tìm thấy phần main thì return.
    if (mainCurrent == undefined) return;

    // Tạo `ResizeObserver` để theo dõi thay đổi kích thước của phần main.
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Cập nhật chiều rộng của main vào store.
        setMainWidth(entry.contentRect.width);
      }
    });

    // Bắt đầu quan sát thay đổi kích thước của phần main.
    observer.observe(mainCurrent);
  }, [setMainWidth]); // Chỉ chạy lại khi `setMainWidth` thay đổi.

  // Lấy giá trị `isDetailsOpen` từ store để kiểm tra panel chi tiết có mở hay không.
  const { isDetailsOpen } = useAppControllerStore((state) => ({ isDetailsOpen: state.isDetailsOpen }));
  return (
    // Thẻ div cha chứa toàn bộ layout của ứng dụng.
    <div className="flex h-screen w-full flex-col gap-2 bg-black p-2">

      {/* Nhóm các panel có thể thay đổi kích thước, hướng ngang. */}
      <ResizablePanelGroup autoSaveId="persistence" className="flex flex-1 gap-1 self-stretch" direction="horizontal">

        {/* Panel Sidebar (Thanh bên trái). */}
        <ResizablePanel
          className="flex min-w-[72px] items-start justify-center"
          defaultSize={3} // Chiếm 3% không gian mặc định.
          maxSize={70} // Kích thước tối đa là 70%.
          minSize={3} // Kích thước tối thiểu là 3%.
          order={1} // Thứ tự panel trong nhóm.
        >
          {/* Sidebar chứa menu điều hướng. */}
          <Sidebar ref={sidebarReference} />
        </ResizablePanel>

        {/* Thanh điều chỉnh kích thước giữa sidebar và phần main. */}
        <ResizableHandle className="-right-1" />

        {/* Panel chứa phần nội dung chính của trang. */}
        <ResizablePanel
          className="grid size-full overflow-hidden text-clip rounded-lg"
          defaultSize={90} // Chiếm 90% không gian mặc định.
          maxSize={90} // Không thể mở rộng quá 90%.
          minSize={30} // Kích thước tối thiểu là 30%.
          order={2} // Thứ tự trong nhóm panel.
        >
          {/* Div chứa nội dung chính của trang, có nền tối nhất. */}
          <div className="grid size-full flex-col overflow-hidden bg-s-gray-darkest" ref={mainReference}>

            {/* Header (Phần tiêu đề / thanh điều hướng trên cùng). */}
            <Header />

            {/* Vùng có thể cuộn chứa nội dung trang (Outlet chứa nội dung của route con). */}
            <ScrollArea className="relative flex flex-1 px-2 pt-16">
              <Outlet />
              <ScrollBar />
            </ScrollArea>
          </div>
        </ResizablePanel>

        {/* Thanh điều chỉnh kích thước giữa main và panel bên phải. */}
        <ResizableHandle className={`-right-1 ${isDetailsOpen ? '' : 'hidden'}`} />

        {/* Panel bên phải hiển thị thông tin "Now Playing Bar" nếu `isDetailsOpen` bật. */}
        <ResizablePanel
          className={`${isDetailsOpen ? 'flex' : 'hidden'
            } min-w-[280px] items-start justify-center overflow-hidden text-clip rounded-lg bg-s-gray-darkest p-2 text-white`}
          defaultSize={12} // Chiếm 12% không gian mặc định.
          maxSize={22} // Không thể mở rộng quá 22%.
          minSize={12} // Kích thước tối thiểu là 12%.
          order={3} // Thứ tự trong nhóm panel.
        >
          Now Playing Bar {/* Hiển thị thông tin về bài hát đang phát. */}
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Footer ở cuối trang, chiều cao cố định 72px. */}
      <div className="h-[72px] shrink-0 self-stretch">
        <Footer />
      </div>
    </div>
  );
}
