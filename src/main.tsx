import './assets/global.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { TooltipProvider } from './components/ui/tooltip.tsx';
import { router } from './routes/router.tsx';

createRoot(document.querySelector('#root')!).render(
  <TooltipProvider>
    <RouterProvider router={router} />
  </TooltipProvider>
);
