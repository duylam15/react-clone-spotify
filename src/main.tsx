import './assets/global.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { TooltipProvider } from './components/ui/tooltip.tsx';
import { router } from './routes/router.tsx';
import { Provider } from 'react-redux';
import store from './stores/playlist/index.ts';

createRoot(document.querySelector('#root')!).render(
  <Provider store={store}>
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  </Provider>
);
