import './assets/global.css';

import { StrictMode as ReactStrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { TooltipProvider } from './components/ui/tooltip.tsx';
import { router } from './routes/router.tsx';

createRoot(document.querySelector('#root')!).render(
  <ReactStrictMode>
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  </ReactStrictMode>,
);
