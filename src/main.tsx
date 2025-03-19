import './assets/global.css';
import './scss/style.scss';
import './scss/examples.scss';
import 'core-js';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';

import { TooltipProvider } from './components/ui/tooltip';
import { router } from './routes/router';
import store from './stores/playlist/index';

// Định nghĩa kiểu cho state của Redux
interface RootState {
  theme: string | null; // Đảm bảo theme có thể là string hoặc null
}

// Component App
const App = () => {
  // Sử dụng type guard để đảm bảo useColorModes không trả về null
  const colorModes = useColorModes('coreui-free-react-admin-template-theme');
  const { isColorModeSet, setColorMode } = colorModes || { isColorModeSet: () => false, setColorMode: () => {} };

  // Sử dụng RootState để định kiểu cho state
  const storedTheme = useSelector((state: RootState) => state.theme) || 'default'; // Cung cấp giá trị mặc định nếu theme là null

  // Sử dụng useEffect với dependency đầy đủ
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, [isColorModeSet, setColorMode, storedTheme]); // Thêm các dependency

  return (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};

// Render
createRoot(document.querySelector('#root')!).render(
  <Provider store={store}>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </Provider>
);